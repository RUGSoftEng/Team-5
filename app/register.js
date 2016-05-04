define(['jquery', 'app/config','app/database', 'parsley' ], function ($, config,db,parsley) {

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
    window.location="login.html?message=register"

  }

  $(document).ready(function(){
    window.Parsley.addValidator('userName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyUsername", [value]);
        return (result.length===0);
      },
      messages: {
        en: 'This username is already used choose another username.'
      }
    });

    window.Parsley.addValidator('emailName', {
      validateString: function(value, requirement) {
        var result = db.getQuery("getUserIdbyEmail", [value]);
        return (result.length===0);
      },
      messages: {
        en: 'This username is already used choose another username.'
      }
    });

  });

});
