/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/database', 'jquery', 'bootstrap', 'parsley', 'app/selectLanguage', 'app/selectSubject', 'app/date'], function (db, $, bootstrap, parsley, language, subject, date) {
	var numberOfFormItems = 0;
	var formItemId = 0;

	// Function for removing elements from the form
	function remove_element(element) {
		if (numberOfFormItems > 1) {
			element.parents("tr").remove();
			numberOfFormItems--;
		}
	}
  
  // Auxiliary replace functions
  function giveId(string, formItemId) {
    return string.replace(/{i}/g, formItemId);
  }
  function giveRequired(string) {
    return string.replace(/{required}/g, 'required=""');
  }

	// Function for adding elements to the form
	function add_element() {
		var newElement = $('#item-layout').clone(true).appendTo("#items table").removeAttr("id");
		newElement.html(giveId(newElement.html(), formItemId));
    newElement.html(giveRequired(newElement.html()));
		newElement.on("click", ".remove", function() {
			remove_element($(this));
		});
		numberOfFormItems++;
		formItemId++;
	}
  
	// Add the first element
	add_element();

	$(".add").click(function(add) {
		add_element();
		return false;
	});

	$('#items input[type="text"]:last').on('keydown', function(e) {
	  if (e.which == 9) { // If a tab is pressed
	      add_element();
	  }
	});

	// Check in the database if the name of the dataset already exists
	window.Parsley.addValidator('datasetName', {
		validateString: function(value, requirement) {
			var result = db.getQuery("getDatasetByName", [value]);
			return (result.length==0) ? true : false;
		},
		messages: {
			en: 'This name is already used for another dataset.'
		}
	});

	// Script for evaluating the input of the upload form
	$(function () {
		$('#createForm').parsley().on('field:validated', function() {
			// Initiate form error and success handling
			var ok = $('.parsley-error').length === 0;
			$('.bs-callout-info').toggleClass('hidden', !ok);
			$('.bs-callout-warning').toggleClass('hidden', ok);
		})
		.on('form:submit', function() {
			return false; // Don't submit form
		})
		.on('form:success', function() {
			// Save data into the database
			var name = $('#createForm').find('input[name="name"]').val();
			var language = $('#createForm').find('select[name="language"]').val();
			var subject = $('#createForm').find('select[name="subject"]').val();
			var currentdate = new Date();

			db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.formatDate(currentdate), date.formatDate(currentdate)]);
			var id = db.lastInsertRowId("tbldatasets", "dataset_id");
			// Save all items in the dataset
			for (i = 0; i<=formItemId; i++) {
				var question = $("#items input[name='question"+i+"']").val();
				var answer = $("#items input[name='answer"+i+"']").val();
				var hint = $("#items input[name='hint"+i+"']").val();
				hint = (hint==="undefined") ? "" : hint;

				db.executeQuery('addDatasetItem' , [id, question, answer, hint]);
			}
			db.close();
			window.location = 'index.html';
		});
	});
});
