/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/lang', 'app/string', 'app/config', 'app/database', 'jquery', 'bootstrap', 'app/select', 'app/forms', 'app/ready', 'app/clone', 'electron-cookies', 'app/user', 'app/keys', 'app/date'], function (lang, string, config, db, $, bootstrap, select, forms, ready, clone, cookies, user,keys,date) {
	var numberOfFormItems = 0;
	var formItemId = 0;

	function removeElementFromForm(element) {
		if (numberOfFormItems > 1) {
			element.parents("tr").remove();
			numberOfFormItems--;
		}
	}

	function addElementToForm() {
		var newElement = $('#items table').cloneLayout();
		newElement.replaceClone(["i", "required"], [formItemId, "required"]);
		// Remove when clicked on close
		newElement.on("click", ".remove", function() {
			removeElementFromForm($(this));
		});
		// When the TAB is pressed, add a new line
		keys.removeKeybinds("keydown");
		newElement.find("input:last").on('keydown', function(e) {
			if (keys.isTab(e.keyCode)) {
					addElementToForm();
			}
		});
		numberOfFormItems++;
		formItemId++;
	}

	// Function for showing the user the system is loading
	function showLoading(onSuccess) {
		$("#loadFrame").children("h1").html(lang("create_busycreating"));
		$("#loadFrame").fadeIn(300, onSuccess);
	}

	function saveDatasetOnline(data, form, subject) {
		db.executeQuery("addDataset", data, false, true);
		db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
			data.unshift(id);
			saveDatasetsLocal(data, form, subject);
		});
	}

	function saveDatasetsLocal(data, form, subject) {
		db.executeQuery("addDatasetAll", data, true, false);
		db.close();

		var language = forms.getFormVal(form, "select", "language");
		var subject = forms.getFormVal(form, "select", "subject");
		window.location = "index.html?message=success_createdataset&language="+language+"&subject="+subject;
	}

	function localisePage() {
		string.fillinTextClasses();
		$("#datasetname").prop("placeholder", lang("placeholder_datasetname"));
		$("#datasetsubject").prop("title", lang("placeholder_subject"));
		$("#customsubject").prop("placeholder", lang("label_customsubject"));
		$("#buttoncreate").prop("value", lang("create_buttoncreate"));
		$("#inputquestion").prop("placeholder", lang("label_question"));
		$("#inputanswer").prop("placeholder", lang("label_answer"));
		$("#inputhint").prop("placeholder", lang("label_hint"));
		$("#popoverSubject").prop("title", lang("label_subject"));
		$("#popoverSubject").data("content", lang("tutorial_datasetsubject"));
		$("#popoverLanguage").prop("title", lang("label_language"));
		$("#popoverLanguage").data("content", lang("tutorial_datasetlanguage"));
	}
	// Replace user data in view from database
	$("span[data-replace]").each(function() {
		var user_info = $(this).data("replace");
		var text = user.get(user_info);
		$(this).html(text);
	});

	function handleCustomSubject() {
		window.Parsley.addValidator('subjectName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getSubjectByName", [value]);
				return result.length === 0;
			},
			messages: {
				en: lang("error_subjectnamenotunique")
			}
		});

		// Display the input for custom subject only if appropriate
		$("#datasetsubject").change(function() {
			var id = forms.getFormVal("#createForm", "select", "subject");
			$("#datasetsubject").data("subject", id);

			if (id == 0) {
				$("#newsubject").attr("hidden", false);
				$("#customsubject").attr("required", "");
				$("#customsubject").attr("data-parsley-subject-name", "1");
			} else {
				$("#newsubject").attr("hidden", true);
				$("#customsubject").removeAttr("required");
				$("#customsubject").removeAttr("data-parsley-subject-name");
			}
		});
	}

	ready.on(function() {
		localisePage();
		handleCustomSubject();
		
		$('#popoverSubject').popover();
		$('#popoverLanguage').popover();
		// Add the first element
		addElementToForm();
		$(".add").click(function() {
			addElementToForm();
			return false;
		});

    function buildDatasetLanguageString(form, select, language)  {
      var lang = forms.getFormVal(form, select, language);
      return lang;
    }
    function buildDatasetSubjectString(form, select, language)  {
      var subject = forms.getFormVal(form, select, subject);
      return subject;
    }

		var form = "#createForm";
		forms.initialize(form);
		forms.onSuccess(form, function() {
			showLoading(function() {
				var form = "#createForm";
				var name = forms.getFormVal(form, "input", "name");
	      var language = forms.getFormVal(form, "select", "language");
	      var subject = $("#datasetsubject").data("subject");
	      var user_id = user.getCookie('user_id');
	      var currentdate = date.formatDatetime(new Date(), true);

				var dataset_items = [];
				for (i = 0; i<formItemId; i++) {
					var question = forms.getItemVal("question", i);
					var answer = forms.getItemVal("answer", i);
					var hint = forms.getItemVal("hint", i);
					hint = (hint==="undefined") ? "" : hint;
					dataset_items.push({"id": i, "text": question, "answer": answer, "hint": hint});
				}
				dataset_items = JSON.stringify(dataset_items);
	      if (db.online()) {
					if (subject == 0) {
						var newsubjectname = $("#customsubject").val();
						db.executeQuery("addSubjectOnline", [newsubjectname, user.getCookie("user_id"), 1], false, true);
						db.lastInsertIdOnline('tblsubjects', 'subject_id', function (subject_id) {
							db.executeQuery("addSubject", [subject_id, newsubjectname, user.getCookie("user_id"), 1], true, false);
							saveDatasetOnline([user_id, name, language, subject_id, 0, 0, 1, currentdate, currentdate, dataset_items], form, subject_id);
						});
					} else {
						saveDatasetOnline([user_id, name, language, subject, 0, 0, 1, currentdate, currentdate, dataset_items], form, subject);
					}
	      } else {
					if (subject == 0) {
						subject = db.lastInsertRowId("tblsubjects", "subject_id") + 1;
						var newsubjectname = $("#customsubject").val();
						db.executeQuery('addSubject' , [subject, newsubjectname, user.getCookie("user_id"), 0]);
					}
	        saveDatasetsLocal([null, user_id, name, language, subject, 0, 0, 0, currentdate, currentdate, dataset_items], form, subject);
	      }
			});
		});

		// Initiate select boxes
		select.initiate("languages", ".selectLanguage");
		select.initiate("subjects", ".selectSubject");

		// Check in the database if the name of the dataset already exists
		window.Parsley.addValidator('datasetName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getDatasetByName", [value]);
				return result.length === 0;
			},
			messages: {
				en: lang("error_datasetnamenotunique")
			}
		});
	});
});
