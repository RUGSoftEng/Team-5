define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string','app/saltedhash','app/date', 'async', 'app/messages'], function ($, config, db, parsley, lang, string,hash,date, async, messages) {

  $("form").submit(function(e){
    e.preventDefault();
    if(db.online()) {
      handleRegister();
    } else {
      alert(lang("error_nointernet_register"));
    }
  });

  function handleRegister(inputs){
    var username = $("#username").val().toLowerCase();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();
    var email = $("#email").val();
    var gender = $("#gender").val();
    var gen = (gender === "male") ? 1:0;
    var dateofbirth = $("#dateofbirth").val();
    var hashed_password = hash.generate(password);
    var datetime = date.formatDatetime(new Date(), true);
    var field;

    db.getOnlineQuery("getUserIdbyUsername", [username], function(rows) {
      if (checkUsername(rows)) {
        db.getOnlineQuery("getUserIdbyEmail", [email], function(rows) {
          if (checkEmail(rows)) {
            addUserLocalAndOnline(username, [null, email,username,gen,dateofbirth,hashed_password, datetime, firstname, lastname,datetime, null]);
          }
        });
      }
    });
  }

  function addUserLocalAndOnline(username, data) {
    db.executeQuery("addUser", data, false, true);
    db.getOnlineQuery('getUserbyUsername',[username], function(rows) {
      if (db.online()) {
        data[0] = rows[0].user_id;
        db.executeQuery("addUser", data, true, false);
        db.close();
        window.location="login.html?message=success_register";
      } else {
        alert(lang("error_nointernet"));
      }
    });
  }

  function checkUsername(result) {
    field = $("#username").parsley();
    if (result.length === 0) {
      field.removeError('error');
      return true;
    } else {
      field.removeError('error');
      field.addError('error', {message: lang("error_usernamenotunique")});
      return false;
    }
  }

  function checkEmail(result) {
    field = $("#email").parsley();
    if (result.length === 0) {
      field.removeError('error');
      return true;
    } else {
      field.removeError('error');
      field.addError('error', {message: lang("error_emailnotunique")});
      return false;
    }
  }

  function localisePage() {
		string.fillinTextClasses();
		$("#username").prop("placeholder", lang("label_username"));
		$("#email").prop("placeholder", lang("label_emailaddress"));
		$("#firstname").prop("placeholder", lang("label_firstname"));
		$("#lastname").prop("placeholder", lang("label_lastname"));
		$("#password").prop("placeholder", lang("label_password"));
		$("#confirm_password").prop("placeholder", lang("label_passwordconfirm"));
	}

  function inputFieldExists(result) {
    return (result.length===0);
  }

  $(document).ready(function(){
  	localisePage();

    if (!db.online()) {
      messages.show("#errors", lang("error_nointernet_register"));
    }

    window.Parsley.addValidator('userName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyUsername", [value]);
        return inputFieldExists(result);
      },
      messages: {
        en: lang("error_usernamenotunique")
      }
    });

    window.Parsley.addValidator('emailName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyEmail", [value]);
        return inputFieldExists(result);
      },
      messages: {
        en: lang("error_emailnotunique")
      }
    });

  });

});
