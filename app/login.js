/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
define(['jquery', 'app/config', 'app/database', 'app/user', 'app/lang', 'app/string', 'app/messages', 'parsley', 'app/forms', 'app/saltedhash', 'app/ready'], function ($, config, db, user, lang, string, messages, parsley, forms, hash, ready) {

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
		if (db.online()) {
			db.getOnlineQuery("getUserbyUsername", [username], function(result) {
				if (checkUsername(result)) {
					if (checkPassword(password, result)) {
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
	}

	function checkUsername(result) {
		field = $("#username").parsley();
		if (result.length !== 0) {
			return true;
		} else {
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

	var form = '#loginForm';
	forms.initialize(form);
	forms.onSuccess(form, handleLogin);

	if ($_GET('message')) {
		messages.show(config.constant("MESSAGES"), lang($_GET('message')));
	}

	// if (user.check()) {
	// 	window.location = "index.html?message=login_automatic";
	// }

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#password").prop("placeholder", lang("label_password"));

	ready.on(function() {
		getPermissionsForDatabase();
	});

});
