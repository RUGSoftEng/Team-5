define(['jquery', 'app/lang'], function($, lang) {
  var loadingPage;
  var elementLoadFrame = "#loadFrame";

  return {
    on: function(callback) {
      loadingPage = setTimeout(function() {
        callback();
        $(elementLoadFrame).fadeOut(300);
      }, 1);
    }
    ,showLoading: function(message=false, callback) {
      if (message) $(elementLoadFrame).children("h1").html(message);
  		$(elementLoadFrame).fadeIn(300, callback);
    }, changeLoadMessage(message) {
      $(elementLoadFrame).children("h1").html(message);
    },
    hideLoading: function() {
      $(elementLoadFrame).hide();
    }
  };
});
