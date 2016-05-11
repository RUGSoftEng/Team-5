define(['jquery', 'app/config', 'app/database', 'parsley', 'app/lang', 'app/string'], function ($, config, db, parsley, lang, string) {
  
  $("form").submit(function(e){
    e.preventDefault();
    handleRegister();
  });

  function handleRegister(inputs){
    var username = $("#username").val().toLowerCase();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();
    var email = $("#email").val();
    var gender = $("#gender").val();
    var dateofbirth = $("#dateofbirth").val();
    var gen = (gender === "male") ? 1:0;
    var date = dateofbirth.split("-");
    dateofbirth = date[2]+"-"+date[1]+"-"+date[0];

    db.executeQuery("addUser",[email,username,gen,dateofbirth,sha256(password), firstname, lastname]);
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
