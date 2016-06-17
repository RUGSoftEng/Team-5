// This module is for general operations on strings that can be used in several applications.

define(['jquery', 'app/lang'], function ($, lang) {
  return {
    // For adding the letter 's' to the end of a word, if it should be plural.
    pluralIfAppropriate: function(number) {
      if (number == 1) {
        return "";
      } else {
        return "s";
      }
    },

		fillinTextClasses: function() {
			var textClasses = $('[class^="text_"]');

			textClasses.each(function(index){
				var className = $(this).attr('class');
				var string = lang(className.slice(5));
				$(this).html(string);
			});

      var inputs = $("input, select");
      inputs.each(function() {
        $(this).attr("data-parsley-required-message", lang("message_required"));
      });
		}
  };
});
