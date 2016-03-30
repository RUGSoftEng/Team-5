/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 */

define(['app/database', 'jquery', 'bootstrap', 'parsley', 'app/selectLanguage', 'app/selectSubject'], function (db, $, bootstrap, parsley, language, subject) {
	var numberOfFormItems = 0;

	// Function for adding elements to the form
	function add_element() {
		var newElement = $('#item-layout').clone(true).appendTo("#items table").removeAttr("id");
		var add_id = newElement.html().replace(/{i}/g, numberOfFormItems);
		newElement.html(add_id);
		numberOfFormItems++;
	}
	// Function for removing elements from the form
	function remove_element() {
		if (numberOfFormItems > 1) {
			$(this).parents("tr").remove();
			numberOfFormItems--;
		}
	}
	// Add the first element
	add_element();

	$(".add").click(function(add) {
		add_element();
		return false;
	});

	$(".remove").click(function() {
		console.log("remove")
		remove_element();
		return false;
	});

	$('#items input[type="text"]:last').on('keydown', function(e) {
	  if (e.which == 9) { // If a tab is pressed
	      add_element();
	  }
	});
});
