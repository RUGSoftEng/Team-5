define(['jquery'], function($) {
  // Initiate page and show loading
  function initiateLoadPage() {
    $("body").append("<div id='loadFrame'></div>");
  }
  initiateLoadPage();

  var loadingPage;
  return {
    on: function(callback) {
      loadingPage = setTimeout(function() {
        // Remove load Page
        console.log("After ready");
        callback();
        $("#loadFrame").fadeOut(300);
      }, 0);
    }
  }
});
