/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:

 */

define(['app/database', 'jquery', 'bootstrap', 'parsley', 'bootstrap-select'], function (db, $, bootstrap, parsley, select) {
	var numberOfFormItems = 1;
	$(".selectpicker").selectpicker();
	$(".add").click(function(add) {
    	numberOfFormItems++;
	   	var newElement = $('#item-layout').clone(true).appendTo("#items table").removeAttr("id");
     	newElement.children("td:nth-child(1)").html(numberOfFormItems);
     	newElement.children("td:nth-child(2) input").attr("name", "question"+numberOfFormItems).addClass("question"+numberOfFormItems);
     	newElement.children("td:nth-child(3) input").attr("name", "answer"+numberOfFormItems).addClass("answer"+numberOfFormItems);
     	newElement.children("td:nth-child(4) input").attr("name", "hint"+numberOfFormItems).addClass("hint"+numberOfFormItems);

     	return false;
	});

	$(".remove").click(function() {
		if (numberOfFormItems < 1) {
	  		$(this).parents("tr").remove();
	  	  	numberOfFormItems--;
        	console.log($(this).parents("table").children().length);
	  	}
	});

	/* Code to add a new item when pressing tab while the hint field of the last item is highlighted */ 
 	if (document.activeElement == ($('#newForm').children[(numberOfFormItems-1)].children[5])) {
		$('#hint').keydown(function (e) {
	   		if (e.keyCode == 9) {
	  		console.log("gfgdg");
	  		}
	 	});
 	};
});
