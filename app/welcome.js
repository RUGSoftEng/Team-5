/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 23/4/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the welcome page.
 */
define(['jquery', 'app/database', 'app/config', 'bootstrap', 'app/clone', 'app/lang', 'app/string', 'app/user', 'app/messages'], function ($, db, config, bootstrap, clone, lang, string, user, messages) {

	//check if the user is logged in
  if (!user.check()) {
    logout("logout_unknown_cookie");
  }

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  function logout(message) {
    user.removeCookie();
    window.location = 'login.html?message='+message;
  }

	function createSidebarElements() {
		var rows = db.getUnique2('getUserModules', 'subject_name', 'language_name', [user.getCookie('user_id')]);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#sidebar_ul').cloneLayout();
      if (i==0) {
        newElement.addClass("active");
      }
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
		var rows = db.getQuery('getUserDatasetsByModule', [user.getCookie('user_id'), languageid, subjectid]);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#container').cloneLayout();
      newElement.replaceClone(["dataset_id", "dataset_name"], [rows[i].dataset_id, rows[i].dataset_name]);
      navigateToLearn(newElement);
		}
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
      messages.show(config.constant("MESSAGES"), $_GET('message'));
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
      messages.hide(config.constant("MESSAGES"));
			createDatasetsGrid(subject, language);
			$(this).parents('.sidebar-nav').find('.active').removeClass('active');
	    $(this).addClass('active');
		});
	});
});
