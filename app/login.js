/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
define(['jquery', 'app/config', 'app/database', 'parsley', 'app/forms','app/cookie'], function ($, config, db, parsley, forms,cookie) {

	console.log(window.cookie);
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
					}
						.bind(ps), 50000);
				}
			}
		};
		electronsudo.exec("chmod 755 database/", options, function (error) {});
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
      case "login":
        message = "You have succesfully logged in.";
        break;
			case "logout":
				message = "You have logged out.";
				break;
			case "logout_unknown_cookie":
				message = "Something went wrong, so you have been logged out. Contact the administrator if this errors keeps occuring.";
				break;
			case "register":
				message = "You have succesfully registered a new account.";
				break;
      default:
        message = "This message is unknown.";
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
		return result = db.getQuery(query, [user]);
	}

	function handleLogin() {
		var result = getUser();
		cookie.set(result);
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
			en : 'This username/email does not exist.'
		}
	});

	window.Parsley.addValidator('password', {
		validateString : function (value) {
			var password = $("#password").val();

			var result = getUser();
			return (result.length!==0 && sha256(password) === result[0].user_password);
		},
		messages : {
			en : 'The password is incorrect'
		}
	});

});