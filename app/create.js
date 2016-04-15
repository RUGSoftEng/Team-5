/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/config', 'app/database', 'jquery', 'bootstrap', 'app/select', 'app/forms', 'async'], function (config, db, $, bootstrap, select, forms, async) {
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
		var newElement;
		async.series([
			function(callback) {
				newElement = $('#item-layout').clone(true).appendTo("#items table").removeAttr("id");
				callback(null, "one");
			}, function(callback) {
				console.log(newElement);
				newElement.html(giveId(newElement.html(), formItemId));
				newElement.html(giveRequired(newElement.html()));
				newElement.on("click", ".remove", function() {
					remove_element($(this));
				});
				removeKeybinds();
				newElement.find("input:last").on('keydown', function(e) {
					if (e.keyCode == config.key("TAB")) {
							add_element();
					}
				});

				numberOfFormItems++;
				formItemId++;
				callback(null, "one");
			}
		], function(err, results) {
			//console.log(results);
		});
	}

	function removeKeybinds() {
		$("#items table input").each(function() {
			$(this).unbind("keydown");
		})
	}

  // Auxiliary replace functions
  function giveId(string, formItemId) {
    return string.replace(/{i}/g, formItemId);
  }
  function giveRequired(string) {
    return string.replace(/{required}/g, 'required=""');
  }

	$(document).ready(function() {
		// Add the first element
		add_element();
		// Bind the click method for adding elements
		$(".add").click(function() {
			add_element();
			return false;
		});

		// Script for evaluating the input of the upload form
		forms.initializeForm('#createForm').on('form:success', function() {
			forms.saveIntoDatabase("createForm");
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
			window.location = 'index.html';
		});

		// Initiate select boxes
		select.initiate("languages", ".selectLanguage");
		select.initiate("subjects", ".selectSubject");

		// Check in the database if the name of the dataset already exists
		window.Parsley.addValidator('datasetName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getDatasetByName", [value]);
				return result.length == 0;
			},
			messages: {
				en: 'This name is already used for another dataset.'
			}
		});
	});
});
