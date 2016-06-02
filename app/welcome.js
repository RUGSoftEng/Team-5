/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 23/4/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the welcome page.
 */
define(['jquery', 'jquery-ui', 'app/database', 'app/config', 'bootstrap', 'app/clone', 'app/lang', 'app/string', 'app/messages', 'app/user', 'app/select', 'app/forms', 'app/date', 'app/ready', 'app/time'], function ($, ui, db, config, bootstrap, clone, lang, string, messages, user, select, forms, date, ready, time) {
	//check if the user is logged in
  if (!user.check()) {
    logout("error_logout");
  }

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggle("slide");
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
      $(this).parent().fadeOut(1000, function() {
        $(this).remove();
      });
			db.executeQuery("deleteDatasetbyId", [id], true, true, function() {
        db.close();
        messages.show("#messages", lang("success_delete_dataset"));
      });
		});
	}

  function navigateToLearn(newElement) {
    newElement.on("click", ".mybutton", function() {
      var id = $(this).data("id");
			var dataset = db.getQuery("getRecentDataset", [id, 1, 0])[0];

			$("#datasetName").html(dataset.dataset_name);
			$("#datasetVersionDate").html(dataset.dataset_lastedited);

			$("#startLearning").click(function() {
				var timelimit = time.minutesToSeconds($("#learningTimeSlider").val());
				window.location = "learn.html?id="+id+"&timelimit="+timelimit;
        return false;
			});
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
		$("#startLearning").prop("value", lang("dataset_startlearning"));
	}

	function getUserDataFromDatabase() {
    $("span[data-replace]").each(function() {
      var user_info = $(this).data("replace");
      var text = user.get(user_info);
      $(this).html(text);
    });
	}

  function getFirstUserSubject() {
    var rows = db.getUnique('getModules', 'subject_name', 'language_name', [user.getCookie('user_id')]);
    return (rows.length!==0) ? rows[0].subject_id : 0;
  }

  function languageId(language) {
    var result = db.getQuery("getLanguageByName", language);
    return (result.length!==0) ? result.language_id : config.constant("ENGLISH");
  }

	function initialiseLearningTimeInput() {
		var initialTime = time.secondsToMinutes(config.constant("TIME_LIMIT"));
		var slider = $("#learningTimeSlider");
		var input = $("#learningTimeInput");

		slider.val(initialTime);
		input.val(initialTime);

		// Connect the slider to the input field
		slider.on('input', function() {
			input.val(slider.val());
		});
		// Connect the input field to the slider
		input.on('input', function() {
			// User cannot give input that is out of bounds
			if (parseInt(input.val()) > parseInt(input.prop('max'))) {
				input.val(input.prop('max'));
			}
			slider.val(input.val());
		});
		// When input field is left blank, reset
		input.on('change', function() {
			if (input.val() === "") {
				input.val(initialTime);
				slider.val(input.val());
			}
		});
	}

  ready.on(function() {
  	select.initiate("gui_languages", ".selectLanguage");

  	var form = '#settingsForm';
		forms.initialize(form);
		forms.onSuccess(form, function() {
  		var newLanguage = $("#language").val();
  		var userid = user.getCookie("user_id");
      var currentdate = date.formatDatetime(new Date(), true);
  		db.executeQuery("updateGUILanguage", [newLanguage, currentdate, userid], true, true, function() {
        user.setCookie(db.getQuery("getUser", [userid]));
    		db.close();
    		window.location = "index.html?message=success_change_language"; // refresh
      });
  	});
  	localisePage();
		initialiseLearningTimeInput();

    var currentSubject = ($_GET('subject')) ? $_GET('subject') : getFirstUserSubject();
    var currentLanguage = ($_GET('language')) ? $_GET('language') : languageId(config.constant("LANGUAGE"));

    // Show message if there is any
    if ($_GET('message')) {
      messages.show(config.constant("MESSAGES"), lang($_GET('message')));
    }

    // Logout button
    $("#logout").click(function() {
      logout("success_logout");
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
});
