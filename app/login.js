/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
define(['jquery', 'app/config', 'app/database', 'parsley', 'app/forms','app/user', 'app/lang', 'app/string', 'app/ready'], function ($, config, db, parsley, forms, user, lang, string, ready) {
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

	// Function for obtaining the GET data from the url
	function $_GET(q,s) {
		s = (s) ? s : window.location.search;
		var re = new RegExp(q+'=([^&]*)','i');
		return (s=s.replace(/^\?/,'&').match(re)) ?s=s[1] :s='';
	}

	function hideMessage() {
		var element = $("#messages");
		element.hide();
	}

	function getUser() {
		var user = $("#username").val().toLowerCase();
		var query = user.indexOf("@") != -1 ? "getUserbyEmail" : "getUserbyUsername";
		result = db.getQuery(query, [user]);
		return result;
	}

	function handleLogin() {
		var result = getUser();
		user.setCookie(result);
		window.location = "index.html?message=login";
	}

	forms.initializeForm('#loginForm', handleLogin);

	if ($_GET('message')) {
		showMessage($_GET('message'));
	}

	window.Parsley.addValidator('userName', {
		validateString : function (value) {
			var result = getUser();
			return (result.length!==0);
		},
		messages : {
			en : lang("error_usernameincorrect")
		}
	});

	window.Parsley.addValidator('password', {
		validateString : function (value) {
			var password = $("#password").val();

			var result = getUser();
			return (result.length!==0 && sha256(password) === result[0].user_password);
		},
		messages : {
			en : lang("error_passwordincorrect")
		}
	});

	if (user.check()) {
		window.location = "index.html?message=login_automatic";
	}

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#password").prop("placeholder", lang("label_password"));
	ready.on(function() {
		getPermissionsForDatabase();
	})

});
