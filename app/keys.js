/* file: keys.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 12/5/2016
 * version 1.0
 *
 * Description:
 * Collection of constant and functions for keypresses
 */
define(['jquery'], function($) {
  var keys = {
    TAB: 9,
    ENTER: 13,
    "0": 48,
    "z": 90,
    BACKSPACE: 8,
		isTab: function(keyCode) {
    return keyCode == keys.TAB;
  	},

		removeKeybinds: function(keybind) {
	  $("#items table input").each(function() {
	    $(this).unbind(keybind);
	  	});
		}
	};
	return keys;
});
