/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 23/4/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the welcome page.
 */
define(['jquery', 'app/database', 'bootstrap', 'app/clone', 'app/lang', 'app/string', 'app/user'], function ($, db, bootstrap, clone, lang, string, user) {

	//check if the user is logged in
  if (!user.check()) {
    logout("logout_unknown_cookie");
  }

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  function logout(message) {
    delete window.cookie;
    window.location = 'login.html?message='+message;
  }

	function createSidebarElements() {
		var rows = db.getUnique2('getModules', 'subject_name', 'language_name', []);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#sidebar_ul').cloneLayout();
      newElement.replaceClone(["subject_id", "language_id", "subject_name", "language_name"],
        [rows[i].subject_id, rows[i].language_id, rows[i].subject_name, rows[i].language_name]);
		}
	}
  
  function navigateToLearn(newElement) {   
    newElement.on("click", ".mybutton", function() {
    var id = $(this).data("id");
    window.location = "learn.html?"+id;
   	});
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
      navigateToLearn(newElement);

		}
	}

  // Function for displaying messages on main screen
  function showMessage(message) {
    var element = $("#messages");
    switch(message) {
      case "create_dataset":
        message = lang("success_createdataset");
        break;
      case "open_dataset":
        message = lang("success_opendataset");
        break;
      case "login":
        message = lang("success_login");
        break;
			case "logout":
				message = lang("success_logout");
				break;
			case "logout_unknown_cookie":
				message = lang("error_logout");
				break;
			case "register":
				message = lang("success_register");
				break;
      default:
        message = lang("message_default");
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

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#password").prop("placeholder", lang("label_password"));
	$("#confirm_password").prop("placeholder", lang("label_passwordconfirm"));

	$(document).ready(function () {
    var currentSubject = ($_GET('subject')) ? $_GET('subject') : 1;
    var currentLanguage = ($_GET('language')) ? $_GET('language') : 1;

    // Show message if there is any
    if ($_GET('message')) {
      showMessage($_GET('message'));
    }

    // Logout button
    $("#logout").click(function() {
      logout("logout");
    });

    // Replace user data in view from database
    $("span[data-replace]").each(function() {
      var user_info = $(this).data("replace");
      var text = user.get(user_info);
      $(this).html(text);
    });
    $("span[data-username]").html(user.get("user_firstname")+" "+user.get("user_lastname"));

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
