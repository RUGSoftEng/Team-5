/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/lang', 'app/string', 'app/config', 'app/database', 'jquery', 'bootstrap', 'app/select', 'app/forms', 'app/ready', 'app/clone', 'electron-cookies', 'app/user'], function (lang, string, config, db, $, bootstrap, select, forms, ready, clone, cookies, user) {
	var numberOfFormItems = 0;
	var formItemId = 0;

	// Function for removing elements from the form
	function remove_element(element) {
		if (numberOfFormItems > 1) {
			element.parents("tr").remove();
			numberOfFormItems--;
		}
	}

	function add_element_to_form() {
		var newElement = $('#items table').cloneLayout();
		newElement.replaceClone(["i", "required"], [formItemId, "required"]);
		// Remove when clicked on close
		newElement.on("click", ".remove", function() {
			remove_element($(this));
		});
		// When the TAB is pressed, add a new line
		removeKeybinds("keydown");
		newElement.find("input:last").on('keydown', function(e) {
			if (isTab(e.keyCode)) {
					add_element_to_form();
			}
		});
		numberOfFormItems++;
		formItemId++;
	}

	function isTab(keyCode){
		return keyCode == config.key("TAB");
	}

	function removeKeybinds(keybind) {
		$("#items table input").each(function() {
			$(this).unbind(keybind);
		});
	}

	// Auxiliary form functions
  function getItemVal(formName, formIndex) {
    return $("#items input[name='" + formName + formIndex + "']").val();
  }
	function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }

	// Function for showing the user the system is loading
	function showLoading(onSuccess) {
		$("#loadFrame").children("h1").html(lang("create_busycreating"));
		$("#loadFrame").fadeIn(300, onSuccess);
	}

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#datasetname").prop("placeholder", lang("placeholder_datasetname"));
	$("#datasetsubject").prop("title", lang("placeholder_subject"));
	$("#buttoncreate").prop("value", lang("create_buttoncreate"));
	$("#inputquestion").prop("placeholder", lang("label_question"));
	$("#inputanswer").prop("placeholder", lang("label_answer"));
	$("#inputhint").prop("placeholder", lang("label_hint"));
	
	// Replace user data in view from database
	$("span[data-replace]").each(function() {
		var user_info = $(this).data("replace");
		var text = user.get(user_info);
		$(this).html(text);
	});
	$("span[data-username]").html(user.get("user_firstname")+" "+user.get("user_lastname"));

	ready.on(function() {
		// Add the first element
		add_element_to_form();
		// Bind the click method for adding elements
		$(".add").click(function() {
			add_element_to_form();
			return false;
		});

		// Script when the form is successfull
		forms.initializeForm('#createForm', function() {
			showLoading(function() {
				// Save dataset
				var form = "#createForm";
				forms.saveDataset(form);
				// Save all items in the dataset
				var id = db.lastInsertRowId("tbldatasets", "dataset_id");
				for (i = 0; i<formItemId; i++) {
					var question = getItemVal("question", i);
					var answer = getItemVal("answer", i);
					var hint = getItemVal("hint", i);
					hint = (hint==="undefined") ? "" : hint;

					console.log(i);

					db.executeQuery('addDatasetItem' , [id, question, answer, hint]);
				}
				db.close();
				var language = getFormVal(form, "select", "language");
	      var subject = getFormVal(form, "select", "subject");
				window.location = "index.html?message=create_dataset&language="+language+"&subject="+subject;
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
