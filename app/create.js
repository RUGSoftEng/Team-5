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

	function saveDatasetsLocal(data, form) {
		db.executeQuery("addDatasetAll", data, true, false);
		db.close();

		var language = forms.getFormVal(form, "select", "language");
		var subject = forms.getFormVal(form, "select", "subject");
		window.location = "index.html?message=create_dataset&language="+language+"&subject="+subject;
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
	}
	// Replace user data in view from database
	$("span[data-replace]").each(function() {
		var user_info = $(this).data("replace");
		var text = user.get(user_info);
		$(this).html(text);
	});

	ready.on(function() {
		localisePage();
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
				var name = forms.getFormVal(form, "input", "name");
	      var language = forms.getFormVal(form, "select", "language");
	      var subject = forms.getFormVal(form, "select", "subject");
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
	        db.executeQuery("addDataset", [user_id, name, language, subject, 0, 0, 1, currentdate, currentdate, dataset_items], false, true);
	        db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
						saveDatasetsLocal([id, user_id, name, language, subject, 0, 0, 1, currentdate, currentdate, dataset_items], form);
	        });
	      } else {
	        saveDatasetsLocal([null, user_id, name, language, subject, 0, 0, 0, currentdate, currentdate, dataset_items], form);
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
