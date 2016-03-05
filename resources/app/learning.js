/* file: learning.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 28/02/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the app. Constants and variables are loaded
 * in from config.js and the functions from functions.js.
 */

// Start timer on top of the page (total time in seconds)
startTimer(600);

var currentItemIndex = 0;
var inTutorial = true;

// Disable autocomplete that provides suggestions when typing words
$('input').attr('autocomplete', 'off');

window.onload=function() {
	showQuestion();
	showProgress();
}

// Check whether the user is in tutorial mode.
// If the user leaves tutorial mode, roll back to the first item.
function checkTutorialStatus() {
	if (inTutorial) {
		if (currentItemIndex == NUMBER_OF_TUTORIAL_QUESTIONS) {
			currentItemIndex = 0;
		} else {
			return true;
		}
	}

	return false;
}

// Read the user input when the Enter key is pressed and evaluate it.
// Then show the next question.
$("form").bind("keypress", function (e) {
	// Keycode 13 is an Enter key
	if (e.keyCode == 13) {
		checkAnswer();
		inTutorial = checkTutorialStatus();
		showQuestion();
	}
});
