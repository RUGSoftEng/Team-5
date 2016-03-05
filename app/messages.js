define(['jquery'], function ($) {
  /* Function show for displaying normal, danger and warning messages.
  * The message is included as html and a class with the corresponding type is
  * added. Within the switch statement the icon is added.
  */

  return {
    show: function(message, type) {
      $("#show .message").html(message);

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
    showHint: function(message) {
      // Functions showHint, showProgress and showQuestion are used to update the hint,
      // the progress bar and the question box respectively.
      $("#hint").show();
      $("#hint .message").html(message);
    }

    // TODO: add a hideHint function too (?)
  }
});
