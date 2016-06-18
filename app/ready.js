define(['jquery', 'app/lang'], function($, lang) {
  var loadingPage;
  var elementLoadFrame = "#loadFrame";
  var message = false;

  return {
    on: function(callback) {
      loadingPage = setTimeout(function() {
        // Remove load Page
        console.log("After ready");
        callback();
        $(elementLoadFrame).fadeOut(300);
      }, 1);
    },
    showLoading: function(message, callback) {
      if (message) $(elementLoadFrame).children("h1").html(message);
  		$(elementLoadFrame).fadeIn(300, callback);
    },
    changeLoadMessage(message) {
      $(elementLoadFrame).children("h1").html(message);
    },
    hideLoading: function() {
      $(elementLoadFrame).hide();
    }
  };
});
