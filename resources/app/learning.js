/* file: learning.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 5/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the app. Constants and variables are loaded
 * in from config.js and the functions from functions.js.
 */

// Start timer on top of the page (total time of the learning session in seconds)
startTimer(600); // TODO: Magic number 600; in the future, user will choose time in main menu.
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
	if (e.key == 'Enter') {
		checkAnswer();
		inTutorial = checkTutorialStatus();
		showQuestion();
	}
});
