// This module is a function module; it handles GUI strings for the purpose of internationalisation.
// A GUI string should be printed as follows in Javascript code:
//     lang("string_name", [varargs...])
// For example, if the language file contains the string binding:
//     message_score : "%s scored %s points."
// Then the following call:
//     lang("message_score", "John", 32)
// Results in the string:
//     "John scored 32 points."

define(['jquery', 'i18n!nls', 'printf'], function ($, i18n, printf) {
  return function() {
		var string = arguments[0];
		var array = [];
		for (i = 1; i < arguments.length; i++) {
			array[i-1] = arguments[i];
		}
		
		return vsprintf(i18n[string], array);
	}
});