/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
define(['jquery', 'app/config', 'app/database', 'app/user', 'app/lang', 'app/string', 'app/messages', 'parsley', 'app/forms', 'app/saltedhash'], function ($, config, db, user, lang, string, messages, parsley, forms, hash) {
	// Ask for permission to write to the database on Linux and Mac OSX
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

					// ... and all other subprocess options described here
					// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
				},
				on : function (ps) {
					ps.stdout.on('data', function (data) {});
					setTimeout(function () {
						ps.kill();
					}.bind(ps), 50000);
				}
			}
		};
		electronsudo.exec("chmod 700 database/", options, function (error) {});
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
				field = $("#username").parsley();
				if (result.length !== 0) {
					field.removeError('error');
					field = $("#password").parsley();
					if (hash.verify(password,result[0].user_password) ) {
						user.setCookie(result);
						// db.synchronize(user.getCookie('user_id'));
						window.location = "index.html?message=login";
					} else {
						field.removeError('error');
						field.addError('error', {message: lang("error_passwordincorrect")});
					}
				} else {
					field.removeError('error');
					field.addError('error', {message: lang("error_usernameincorrect")});
				}
			});
		} else {
			var result = db.getQuery("getUserbyUsername", [username]);
			field = $("#username").parsley();
			if (result.length !== 0) {
				field.removeError('error');
				field = $("#password").parsley();
				if (hash.verify(password,result[0].user_password) ) {
					user.setCookie(result);
					window.location = "index.html?message=login";
				} else {
					field.removeError('error');
					field.addError('error', {message: lang("error_passwordincorrect")});
				}
			} else {
				field.removeError('error');
				field.addError('error', {message: lang("error_usernameincorrect")});
			}
		}
	}

	forms.initializeForm('#loginForm', handleLogin);

	if ($_GET('message')) {
		messages.show(config.constant("MESSAGES"), $_GET('message'));
	}

	if (user.check()) {
		window.location = "index.html?message=login_automatic";
	}

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#password").prop("placeholder", lang("label_password"));

});
