/* file: cookie.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 22/4/2016
 * version 1.0
 *
 * Description: Module for using Cookies
 */
require('electron-cookies');
define(['app/database'], function (db) {
  var cookie={
  set: function(result){
    document.cookie ='user_name='+result[0].user_name;
    document.cookie = 'user_id='+result[0].user_id;
    document.cookie = 'user_password='+result[0].user_password;
    document.cookie = 'expires=Thu, 18 Dec 2013 12:00:00 UTC';
  },
  getUser: function (){
    var user = {id:cookie.get('user_id'),name:cookie.get('user_name'), password: cookie.get('user_password') };
    var result = db.getQuery("getUserbyUsername", [user.name]);
    if (result.length==0 || user.password != result[0].user_password) {
        window.location= 'login.html';
    } else {
      return user;
    }
  },
  checkUser: function() {
    var user = {id:cookie.get('user_id'),name:cookie.get('user_name'), password: cookie.get('user_password') };
    var result = db.getQuery("getUserbyUsername", [user.name]);
    return result.length!==0;
  },
  get:function(cname) {
     var name = cname + "=";
     var cookies = document.cookie.split(';');
     for(var i = 0; i < cookies.length; i++) {
       var c = cookies[i];
       while (c.charAt(0) == ' ') {
         c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
       }
     }
     return "";
   }
 }
 return cookie;
});
