/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 17/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the welcome  page.
 */

define(['jquery', 'app/database', 'bootstrap', 'app/clone'], function ($, db, bootstrap, clone) {
  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

	function createSidebarElements() {
		var rows = db.getUnique('getModules', 'subject_name', []);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#sidebar_ul').cloneLayout();
      newElement.replaceClone(["subject_id", "language_id", "subject_name", "language_name"],
        [rows[i].subject_id, rows[i].language_id, rows[i].subject_name, rows[i].language_name]);
		}
	}

	function createDatasetsGrid(subjectid, languageid) {
    // Clear dataset grid
    $("#container .dataset_item").not("#layout").remove();
    // And load new items
		var rows = db.getQuery('getDatasets', [languageid, subjectid]);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#container').cloneLayout();
      newElement.replaceClone(["dataset_id", "dataset_name"], [rows[i].dataset_id, rows[i].dataset_name]);
		}
    // Go to learn page on click
    $(".mybutton").click(function() {
      var id = $(this).attr("id");
      window.location.href = "learn.html?"+id;
    })
	}

	$(document).ready(function () {
    var url = window.location.href;
    var get = url.substring(url.indexOf('?')+1);

		createSidebarElements();
    createDatasetsGrid(1,1);
		$(".sidebar_li").click(function () {
      var subject = $(this).children("a").attr("subject_id");
      var language = $(this).children("a").attr("language_id");
			createDatasetsGrid(subject, language);
			$(this).parents('.sidebar-nav').find('.active').removeClass('active');
	    $(this).addClass('active');
		});
	});
});
