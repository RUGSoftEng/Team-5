define(['jquery', 'app/config','app/database','parsley' ], function ($, config,db,parsley) {
  
  $("form").submit(function(e){
    e.preventDefault();
    var user = $("#username").val();
    var password = $("#password").val();
    console.log(user+" "+password);
    handleLogin(user,password);
    return false;
  });

  function handleLogin(user,password){
    
    var query = user.indexOf("@") != -1 ? "getUserIdbyEmail": "getUserIdbyUsername";
    var result = db.getQuery(query,[user]);

      if(sha256(password)== result[0].user_password){
        //document.cookie ='username='+result[0].user_name+';userId='+result[0].user_id+' path=/';
        window.location = "index.html";
  
      }else{
        alert('wrong password');
      }    

  }
  

  window.Parsley.addValidator('userName', {
      validateString: function(value) {
        var query = value.indexOf("@") != -1 ? "getUserIdbyEmail": "getUserIdbyUsername";
        var result = db.getQuery(query, [value]);
        return (result.length==1);
      },
      messages: {
        en: 'This username/email does not exist.'
      }
    });
  
});

  
  

