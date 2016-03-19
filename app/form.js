/* file: form.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 19/3/2016
 * version 1.1
 *
 * Description:
 
 */

define(['app/database', 'jquery'], function (db, $) {
  var numberOfFormItems = 2;
  $(".add").click(function() {
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
});


