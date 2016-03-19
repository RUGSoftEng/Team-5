/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 
 */

define(['app/database', 'jquery'], function (db, $) {
	 var numberOfFormItems = 2;

	 $(".add").click(function(add) {
	   $('.itemform > :nth-child(2)').clone(true).insertBefore(".itemform > p:last-child");
	   numberOfFormItems++;
	   return false;
	 });

	 $(".remove").click(function() {
	  if (numberOfFormItems != 2) {
	  		$(this).parent().remove();	
	  	numberOfFormItems--;
	  	}
	 });

 	if (document.activeElement == ($('.itemform').children[(numberOfFormItems-1)].children[5])) {
	   $('#hint').keydown(function (e) {
	   	if (e.keyCode == 9) {
	  		console.log("gfgdg");
	  	}
	  });
 	};  	
});


