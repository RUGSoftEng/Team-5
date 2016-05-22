define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string','app/saltedhash','app/date', 'async', 'app/messages'], function ($, config, db, parsley, lang, string,hash,date, async, messages) {

  $("form").submit(function(e){
    e.preventDefault();
    if(db.online()) {
      handleRegister();
    } else {
      alert("you cannot register offline.\n please check your internet connection");
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
      field = $("#username").parsley();
      if (rows.length === 0) {
        field.removeError('usernamenotunique');
        db.getOnlineQuery("getUserIdbyEmail", [email], function(rows) {
          field = $("#email").parsley();
          if (rows.length === 0) {
            field.removeError('emailnotunique');
            db.executeQuery("addUser",[null, email,username,gen,dateofbirth,hashed_password, datetime, firstname, lastname,datetime, null],false,true);
            db.getOnlineQuery('getUserbyUsername',[username], function(rows) {
              if (rows) {
                db.executeQuery("addUser",[rows[0].user_id, email,username,gen,dateofbirth,hashed_password,datetime, firstname, lastname,datetime, null],true,false);
                db.close();
                window.location="login.html?message=register";
              } else {
                alert(lang("error_nointernet"));
                window.location="register.html";
              }
            });
          } else {
            field.removeError('emailnotunique');
            field.addError('emailnotunique', {message: lang("error_emailnotunique")});
          }
        });
      } else {
        field.removeError('usernamenotunique');
        field.addError('usernamenotunique', {message: lang("error_usernamenotunique")});
      }
    });
  }

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#email").prop("placeholder", lang("label_emailaddress"));
	$("#firstname").prop("placeholder", lang("label_firstname"));
	$("#lastname").prop("placeholder", lang("label_lastname"));
	$("#password").prop("placeholder", lang("label_password"));
	$("#confirm_password").prop("placeholder", lang("label_passwordconfirm"));

});
