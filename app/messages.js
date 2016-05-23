define(['jquery', 'app/user', 'app/lang', 'app/string'], function ($, user, lang, string) {

  var messages = {
    getMessage: function (message) {
      switch(message) {
        case "create_dataset":
          message = lang("success_createdataset");
          break;
        case "open_dataset":
          message = lang("success_opendataset");
          break;
        case "login":
          message = lang("success_login");
          break;
  			case "login_automatic":
  				message = lang("success_loginautomatic", user.get("user_firstname"));
  				break;
  			case "logout":
  				message = lang("success_logout");
  				break;
  			case "logout_unknown_cookie":
  				message = lang("error_logout");
  				break;
  			case "register":
  				message = lang("success_register");
  				break;
        case "nointernet":
          message = lang("error_nointernetconnection");
          break;
        case "change_language":
          message = lang("success_change_language");
          break;
        case "success_delete_dataset":
          message = lang("success_delete_dataset");
          break;
      }
      return message;
    },
    show: function(name, message) {
      var element = $(name);
      if (element.length) {
        element.append("<p>"+messages.getMessage(message)+"</p>").show();
      }
    },
    hide: function(name) {
      var element = $(name);
      if (element.length) {
        element.hide();
      }
    }
  };
  return messages;
});
