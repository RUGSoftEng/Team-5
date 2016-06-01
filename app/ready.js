define(['jquery'], function($) {
  // Initiate page and show loading
  var loadingPage;
  return {
    on: function(callback) {
      loadingPage = setTimeout(function() {
        // Remove load Page
        console.log("After ready");
        callback();
        $("#loadFrame").fadeOut(300);
      }, 1);
    },
    showLoading: function(message=false, callback) {
      if (message)
        $("#loadFrame").children("h1").html(message);
  		$("#loadFrame").fadeIn(300, callback);
    }, changeLoadMessage(message) {
      $("#loadFrame").children("h1").html(message);
    },
    hideLoading: function() {
      $("#loadFrame").hide();
    }
  };
});
