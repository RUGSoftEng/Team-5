/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the login page.
 */
define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string'], function ($, config, db, parsley, lang, string) {

	// Ask for permission to write to the database on Linux and Mac OSX
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
					ps.kill()
				}
					.bind(ps), 50000);
			}
		}
	};
	electronsudo.exec("chmod 755 database/", options, function (error) {});
	$("form").submit(function (e) {
		e.preventDefault();
		var user = $("#username").val();
		var password = $("#password").val();
		console.log(user + " " + password);
		handleLogin(user, password);
		return false;
	});

	function handleLogin(user, password) {

		var query = user.indexOf("@") != -1 ? "getUserIdbyEmail" : "getUserIdbyUsername";
		var result = db.getQuery(query, [user]);

		if (sha256(password) == result[0].user_password) {
			//document.cookie ='username='+result[0].user_name+';userId='+result[0].user_id+' path=/';
			window.location = "index.html";

		} else {
			alert(lang("error_passwordincorrect"));
		}

	}

	window.Parsley.addValidator('userName', {
		validateString : function (value) {
			var query = value.indexOf("@") != -1 ? "getUserIdbyEmail" : "getUserIdbyUsername";
			var result = db.getQuery(query, [value]);
			return (result.length == 1);
		},
		messages : {
			en : lang("error_usernameincorrect")
		}
	});
	
	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#password").prop("placeholder", lang("label_password"));

});
