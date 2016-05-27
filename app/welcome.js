/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 23/4/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the welcome page.
 */
define(['jquery', 'app/database', 'app/config', 'bootstrap', 'app/clone', 'app/lang', 'app/string', 'app/messages', 'app/user', 'app/select', 'app/forms', 'app/date'], function ($, db, config, bootstrap, clone, lang, string, messages, user, select, forms, date) {
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

	function createSidebarElements(currentSubject, currentLanguage) {
		var rows = db.getUnique('getModules', 'subject_name', 'language_name', [user.getCookie('user_id')]);
		for (var i = 0; i < rows.length; i++) {
      var newElement = $('#sidebar_ul').cloneLayout();
      newElement.replaceClone(["subject_id", "language_id", "subject_name", "language_name"],
        [rows[i].subject_id, rows[i].language_id, rows[i].subject_name, rows[i].language_name]);
			if (rows[i].subject_id == currentSubject && rows[i].language_id == currentLanguage) {
				newElement.find('a').addClass("active");
			}
		}
	}

	function deleteDataset(newElement) {
		newElement.on("click", ".removebutton", function() {
      var id = $(this).data("id");
      $(this).parent().html("");
			db.executeQuery("deleteDatasetbyId", [id], true, true, function() {
        db.close();
        messages.show("#messages", "success_delete_dataset");
      })
		});
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
      deleteDataset(newElement);
    }
	}

  // Function for obtaining the GET data from the url
  function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp(q+'=([^&]*)','i');
    return (s=s.replace(/^\?/,'&').match(re)) ?s=s[1] :s='';
  }

	function localisePage() {
		string.fillinTextClasses();
		$("#username").prop("placeholder", lang("label_username"));
		$("#password").prop("placeholder", lang("label_password"));
		$("#confirm_password").prop("placeholder", lang("label_passwordconfirm"));
    $("#button_savesettings").prop("value", lang("settings_buttonsave"));
	}

	function getUserDataFromDatabase() {
    $("span[data-replace]").each(function() {
      var user_info = $(this).data("replace");
      var text = user.get(user_info);
      $(this).html(text);
    });
	}

	// Initiate select boxes
	select.initiate("gui_languages", ".selectLanguage");

	// Script when the settings form is successful
	forms.initializeForm('#settingsForm', function() {
		var newLanguage = $("#language").val();
		var userid = user.getCookie("user_id");
    var currentdate = date.formatDatetime(new Date(), true);
		db.executeQuery("updateGUILanguage", [newLanguage, currentdate, userid], true, true, function() {
      user.setCookie(db.getQuery("getUser", [userid]));
  		db.close();
  		window.location = "index.html?message=change_language"; // refresh
    });
	});
	localisePage();
  
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

  getUserDataFromDatabase();
	createSidebarElements(currentSubject, currentLanguage);
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
