/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/config', 'app/database', 'jquery', 'bootstrap', 'app/select', 'app/forms', 'app/ready', 'app/clone'], function (config, db, $, bootstrap, select, forms, ready, clone) {
	var numberOfFormItems = 0;
	var formItemId = 0;

	// Function for removing elements from the form
	function remove_element(element) {
		if (numberOfFormItems > 1) {
			element.parents("tr").remove();
			numberOfFormItems--;
		}
	}

	// Function for adding elements to the form
	function add_element() {
		var newElement = $('#items table').cloneLayout();
		newElement.replaceClone(["i", "required"], [formItemId, "required"]);
		// Remove when clicked on close
		newElement.on("click", ".remove", function() {
			remove_element($(this));
		});
		// When the TAB is pressed, add a new line
		removeKeybinds("keydown");
		newElement.find("input:last").on('keydown', function(e) {
			if (e.keyCode == config.key("TAB")) {
					add_element();
			}
		});
		numberOfFormItems++;
		formItemId++;
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
		$("#loadFrame").children("h1").html("Creating dataset...");
		$("#loadFrame").fadeIn(300, onSuccess);
	}

	ready.on(function() {
		// Add the first element
		add_element();
		// Bind the click method for adding elements
		$(".add").click(function() {
			add_element();
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
				for (i = 0; i<=formItemId; i++) {
					var question = getItemVal("question", i);
					var answer = getItemVal("answer", i);
					var hint = getItemVal("hint", i);
					hint = (hint==="undefined") ? "" : hint;

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
				en: 'This name is already used for another dataset.'
			}
		});
	});
});
