define(['jquery', 'app/config','app/database', 'parsley' ], function ($, config,db,parsley) {

  $("form").submit(function(e){
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();
    var email = $("#email").val();
    var gender = $("#gender").val();
    var dateofbirth = $("#dateofbirth").val();
    handleRegister(username,password,email,gender,dateofbirth);
  });

  function handleRegister(username,password,email,gender,dateofbirth){

    var gen = gender == "male" ? 1:0;
    var date = dateofbirth.split("-");
    dateofbirth = date[2]+"-"+date[1]+"-"+date[0];
    db.executeQuery("addUser",[email,username,gen,dateofbirth,sha256(password)] );
    db.close();

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
