/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
define(['jquery', 'bootstrap', 'app/config', 'app/database', 'app/user', 'app/lang', 'app/string', 'app/messages', 'parsley', 'app/forms', 'app/saltedhash', 'app/ready', 'app/select'], function ($, bootstrap, config, db, user, lang, string, messages, parsley, forms, hash, ready, select) {

	function showPermissionsMessage() {
		if (navigator.appVersion.indexOf("Mac")!=-1) {
			   if (!localStorage['done']) {
       				localStorage['done'] = 'yes';
       				alert(lang("message_permission"));
   				}

		}
	}

	function getPermissionsForDatabase() {
		if (navigator.appVersion.indexOf("Mac")!=-1){
			var options = {
				name : 'SlimStampen',
				//icns: '/path/to/icns/file', // (optional, only for MacOS),
				process : {
					options : {
						// Can use custom environment variables for your privileged subprocess
						env : {
							'VAR' : 'VALUE'
						}
					}
				}
			};
			electronsudo.exec("chmod 600 database/user.sqlite", options, function (error) {});
		}
	}

	// Function for obtaining the GET data from the url
  function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp(q+'=([^&]*)','i');
    return (s=s.replace(/^\?/,'&').match(re)) ?s=s[1] :s='';
  }
	function getUser() {
		var user = $("#username").val().toLowerCase();
		var query = user.indexOf("@") != -1 ? "getUserbyEmail" : "getUserbyUsername";
		result = db.getQuery(query, [user]);
		return result;
	}

	function handleLogin() {
		var username = $("#username").val().toLowerCase();
		var password = $("#password").val();
		var field;
		ready.showLoading(lang("login_checking"), function() {
			if (db.online()) {
				db.getOnlineQuery("getUserbyUsername", [username], function(result) {
					if (checkUsername(result)) {
						if (checkPassword(password, result)) {
							ready.changeLoadMessage(lang("login_synchronizing"));
							user.setCookie(result);
							synchronizeAndLogin();
						}
					}
				});
			} else {
				var result = db.getQuery("getUserbyUsername", [username]);
				if (checkUsername(result)) {
					if (checkPassword(password, result)) {
						user.setCookie(result);
						login();
					}
				}
			}
		});
	}

	function checkUsername(result) {
		field = $("#username").parsley();
		if (result.length !== 0) {
			return true;
		} else {
			ready.hideLoading();
			field.removeError('error');
			field.addError('error', {message: lang("error_usernameincorrect")});
			return false;
		}
	}

	function checkPassword(password, result) {
		field.removeError('error');
		field = $("#password").parsley();
		if (hash.verify(password,result[0].user_password) ) {
			return true;
		} else {
			ready.hideLoading();
			field.removeError('error');
			field.addError('error', {message: lang("error_passwordincorrect")});
			return false;
		}
	}

	function synchronizeAndLogin() {
		db.synchronize(user.getCookie('user_id'), function() {
			db.close();
			login();
		});
	}

	function login() {
		window.location = "index.html?message=success_login";
	}
	
	function initialiseLanguageSettings() {
		select.initiate("gui_languages", ".selectLanguage");
		
		var form = '#settingsForm';
		forms.initialize(form);
		forms.onSuccess(form, function() {
  		var newLanguage = $("#language").val();
			document.cookie = 'user_language='+newLanguage;
    	window.location = "login.html"; // refresh
  	});
	}
	
	function initialiseLoginForm() {
		var form = '#loginForm';
		forms.initialize(form);
		forms.onSuccess(form, handleLogin);
	}
	
	function localisePage() {
		string.fillinTextClasses();
		$("#username").prop("placeholder", lang("label_username"));
		$("#password").prop("placeholder", lang("label_password"));
		$("#button_savesettings").prop("value", lang("settings_buttonsave"));
	}

	if ($_GET('message')) {
		messages.show(config.constant("MESSAGES"), lang($_GET('message')));
	}

	// if (user.check()) {
	// 	window.location = "index.html?message=login_automatic";
	// }

	ready.on(function() {
		localisePage();
		showPermissionsMessage();
		getPermissionsForDatabase();
		initialiseLoginForm();
		initialiseLanguageSettings();
	});

});
