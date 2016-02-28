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
// Disable autocomplete that provides suggestions when typing words
$('input').attr('autocomplete', 'off');

window.onload=function() {
	showQuestion();
	showProgress();
}

// Read the user input when an enter is pressed and evaluate it. Then show
// the next question.
$("form").bind("keypress", function (e) {
	if (e.keyCode == 13) {
		checkAnswer();

		if (inTutorial && i == NUMBER_OF_TUTORIAL_QUESTIONS) {
			i = 0;
			inTutorial = false;
		}

		showQuestion();
		return false;
	}
});
