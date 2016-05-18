/* file: cookie.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 22/4/2016
 * version 1.0
 *
 * Description: Module for using Cookies
 */
require('electron-cookies');
define(['app/database'], function (db) {
  var user={
  setCookie: function(result){
    document.cookie = 'user_name='+result[0].user_name;
    document.cookie = 'user_id='+result[0].user_id;
    document.cookie = 'user_password='+result[0].user_password;
  },
  removeCookie: function() {
    document.cookie = "user_name=''";
    document.cookie = "user_id=''";
    document.cookie = "user_password=''";
  },
  get: function (item){
    var result = db.getQuery("getUserbyUsername", [user.getCookie('user_name')]);
    if (typeof item === 'undefined') {
      return result;
    } else {
      return (result.length!==0) ? result[0][item] : result;
    }
  },
  check: function() {
    var user_name = user.getCookie("user_name");
    var result = db.getQuery("getUserbyUsername", [user_name]);
    console.log(result.length);
    return (result.length!==0 && user.getCookie('user_password') === result[0].user_password);
  },
  getCookie:function(cname) {
     var name = cname + "=";
     var cookies = document.cookie.split(';');
     for(var i = 0; i < cookies.length; i++) {
       var c = cookies[i];
       while (c.charAt(0) == ' ') {
         c = c.substring(1);
       }
       if (c.indexOf(name) === 0) {
         return c.substring(name.length, c.length);
       }
     }
     return "";
   }
 };
 return user;
});
