/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 17/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
 
 define([ 'jquery', 'bootstrap'], function ($, bootstrap) {

	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
});
