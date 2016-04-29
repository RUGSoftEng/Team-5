// This module is for general operations on strings that can be used in several applications.

define([], function () {
  return {
    // For adding the letter 's' to the end of a word, if it should be plural.
    pluralIfAppropriate: function(number) {
      if (number == 1) {
        return "";
      } else {
        return "s";
      }
    }
  };
});
