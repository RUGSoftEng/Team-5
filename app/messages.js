define(['jquery'], function ($) {
  var messages = {
    show: function(name, message) {
      var element = $(name);
      if (element.length) {
        element.append(message).show();
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
