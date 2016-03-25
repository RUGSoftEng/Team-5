define(['jquery', 'app/timer'], function ($, timer) {
  /* Function show for displaying normal, danger and warning messages.
  * The message is included as html and a class with the corresponding type is
  * added. Within the switch statement the icon is added.
  */

  return {
    show: function(message, type, countdown) {
      countdown /= 1000;
      if (countdown > 0) {
        $("#show .message").html(message + "<br> <span class=\"countdownnotice\">Press enter to continue or wait <span class=\"countdown\" data-seconds=\"" + countdown + "\"></span> seconds.</span>");
        timer.startCountdown(".countdown", countdown);
      } else {
        $("#show .message").html(message);
      }

      $("#show").removeClass("alert-success alert-danger alert-warning");
      $("#show").addClass("alert-"+type);

      $("#show .icon .glyphicon").removeClass("glyphicon-ok-sign glyphicon-remove-sign glyphicon-exclamation-sign");

      switch (type) {
        case 'success':
          $("#show .icon .glyphicon").addClass("glyphicon-ok-sign");
          break;
        case 'danger':
          $("#show .icon .glyphicon").addClass("glyphicon-remove-sign");
          break;
        case 'warning':
          $("#show .icon .glyphicon").addClass("glyphicon-exclamation-sign");
          break;
        default:
          $("#show .icon .glyphicon").addClass("glyphicon-ok-sign");
          break;
      }
    },
    
    clear: function() {
      $("#show .message").html("");
      $("#show").removeClass("alert-success alert-danger alert-warning");
      $("#show .icon .glyphicon").removeClass("glyphicon-ok-sign glyphicon-remove-sign glyphicon-exclamation-sign");
    },
    
    showHint: function(message) {
      // Functions showHint, showProgress and showQuestion are used to update the hint,
      // the progress bar and the question box respectively.
      $("#hint").show();
      $("#hint .message").html(message);
    }

    // TODO: add a hideHint function too (?)
  }
});
