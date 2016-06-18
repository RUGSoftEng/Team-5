define(['jquery', 'app/config'], function ($, config) {
  var messages = {
    show: function(name, message) {
      var element = $(name);
      if (element.length) {
        element.append(message+"<br>").show();
      }
    },
    hide: function(name) {
      var element = $(name);
      if (element.length) {
        element.hide();
      }
    },
    remove: function(name) {
      var element = $(name);
      if (element.length) {
        element.html("");
        element.hide();
      }
    },
    removeAll: function() {
      var errors = $(config.constant("ERRORS"));
      var messages = $(config.constant("MESSAGES"));
      if (errors.length) errors.html("").hide();
      if (messages.length) messages.html("").hide();
    }
  };
  return messages;
});
