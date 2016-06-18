define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string','app/saltedhash','app/date', 'async', 'app/messages', 'app/ready', 'app/forms', 'app/email', 'app/select'], function ($, config, db, parsley, lang, string,hash,date, async, messages, ready, forms, email, select) {
  function handleForgot() {
    var username = $("#username").val().toLowerCase();
    ready.showLoading(function() {
      db.getOnlineQuery("getUserbyUsername", [username], function(rows) {
        if (checkUsername(rows)) {
          var password = randomPassword(10);
          var hashed_password = hash.generate(password);
          var lastedited = date.formatDatetime(new Date(), true);
          var message = lang("email_forgot_password", rows[0].user_firstname, rows[0].user_lastname, password);

          resetPassword(message, rows[0].user_email, [hashed_password, lastedited, rows[0].user_id], function() {
            db.close();
            window.location = "login.html?message=login_passwordreset";
          });
        } else {
          ready.hideLoading();
        }
      });
    });
  }

  function randomPassword(length) {
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < length; x++) {
          var i = Math.floor(Math.random() * chars.length);
          pass += chars.charAt(i);
      }
      return pass;
  }

  function resetPassword(message, to, data, callback) {
    db.executeQuery("updateUserPassword", data, true, true, function() {
      email.send(to, lang("forgot_newpassword"), message, callback);
    });
  }

  function checkUsername(result) {
    field = $("#username").parsley();
    if (result.length !== 0) {
      field.removeError('error');
      return true;
    } else {
      field.removeError('error');
      field.addError('error', {message: lang("error_usernameincorrect")});
      return false;
    }
  }

  function localisePage() {
		string.fillinTextClasses();
		$("#username").prop("placeholder", lang("label_username"));
	}

  function inputFieldExists(result) {
    return (result.length === 0);
  }

  function initialiseLanguageSettings() {
		select.initiate("gui_languages", ".selectLanguage");

		var form = '#settingsForm';
		forms.initialize(form);
		forms.onSuccess(form, function() {
  		var newLanguage = $("#language").val();
			document.cookie = 'user_language='+newLanguage;
    	window.location = "register.html"; // refresh
  	});
	}

  ready.on(function() {
    initialiseLanguageSettings();

    var form = "#forgotForm";
    forms.initialize(form);
    forms.onSuccess(form, function() {
      if(db.online()) {
        handleForgot();
      } else {
        alert(lang("error_nointernet_forgot"));
      }
    });

  	localisePage();

    if (!db.online()) {
      messages.show("#errors", lang("error_nointernet_forgot"));
    }
  });

});
