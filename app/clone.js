/* file: clone.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 22/4/2016
 * version 1.0
 *
 * Description:
 */

define(['jquery'], function ($) {
  // Replace all occurences of replaceFrom[i] to replaceTo[i]
  $.fn.replaceStrings = function(replaceFrom, replaceTo) {
    var content = this[0].outerHTML // Use the outer HTML
    for (i = 0; i<replaceFrom.length;i++) {
      var regular_expression = new RegExp("{"+replaceFrom[i]+"}", "g");
      content = content.replace(regular_expression, replaceTo[i]);
    }
    this[0].outerHTML = content;
  };

  // Clone layout function and return it
  $.fn.cloneLayout = function() {
    return this.find("#layout").clone(true).appendTo(this).removeAttr("id");
  }
});
