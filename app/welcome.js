/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 23/4/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the welcome page.
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
    // And load all new datasets
		var rows = db.getQuery('getDatasets', [languageid, subjectid]);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#container').cloneLayout();
      newElement.replaceClone(["dataset_id", "dataset_name"], [rows[i].dataset_id, rows[i].dataset_name]);
      // Goto learn page on click
      newElement.on("click", ".mybutton", function() {
        var id = $(this).data("id");
        window.location = "learn.html?"+id;
      });
		}
	}

  // Function for displaying messages on main screen
  function showMessage(message) {
    var element = $("#messages");
    switch(message) {
      case "create_dataset":
        message = "You have succesfully created a new dataset.";
        break;
      case "open_dataset":
        message = "You have succesfully uploaded a new dataset.";
        break;
      default:
        message = "This message is unknown.";
    }
    element.append("<p>"+message+"</p>").show();
  }

  function hideMessage() {
    var element = $("#messages");
    element.hide();
  }

  // Function for obtaining the GET data from the url
  function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp(q+'=([^&]*)','i');
    return (s=s.replace(/^\?/,'&').match(re)) ?s=s[1] :s='';
  }

	$(document).ready(function () {
    var currentSubject = ($_GET('subject')) ? $_GET('subject') : 1;
    var currentLanguage = ($_GET('language')) ? $_GET('language') : 1;

    // Show message if there is any
    if ($_GET('message')) {
      showMessage($_GET('message'));
    }

		createSidebarElements();
    createDatasetsGrid(currentSubject,currentLanguage);
		$(".sidebar_li a").click(function () {
      var subject = $(this).data("subject-id");
      var language = $(this).data("language-id");
      hideMessage();
			createDatasetsGrid(subject, language);
			$(this).parents('.sidebar-nav').find('.active').removeClass('active');
	    $(this).addClass('active');
		});
	});
});
