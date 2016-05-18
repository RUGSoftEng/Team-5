define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string','app/saltedhash','app/date'], function ($, config, db, parsley, lang, string,hash,date) {

  $("form").submit(function(e){
    e.preventDefault();
    if(db.online()){
      handleRegister();
    }else {
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
    var dateArray = dateofbirth.split("-");
    dateofbirth = dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0];
    var hashed_password = hash.generate(password);
    var datetime = date.dateToDATETIME(new Date());


    db.executeQuery("addUser",[email,username,gen,dateofbirth,hashed_password, firstname, lastname,datetime,datetime],false,true);
    row = db.getQueryOnline('getUserbyUsername',[username]);
    console.log(row);
    db.executeQuery("addUserOffline",[row[0].user_id, email,username,gen,dateofbirth,hashed_password, firstname, lastname,datetime,datetime],true,false);
    db.close();

    window.location="login.html?message=register";

  }
	// Write localisable text to the page
	string.fillinTextClasses();
	$("#username").prop("placeholder", lang("label_username"));
	$("#email").prop("placeholder", lang("label_emailaddress"));
	$("#firstname").prop("placeholder", lang("label_firstname"));
	$("#lastname").prop("placeholder", lang("label_lastname"));
	$("#password").prop("placeholder", lang("label_password"));
	$("#confirm_password").prop("placeholder", lang("label_passwordconfirm"));


  $(document).ready(function(){
    window.Parsley.addValidator('userName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyUsername", [value]);
        return (result.length===0);
      },
      messages: {
        en: lang("error_usernamenotunique")
      }
    });

    window.Parsley.addValidator('emailName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyEmail", [value]);
        return (result.length===0);
      },
      messages: {
        en: lang("error_emailnotunique")
      }
    });

  });

});
