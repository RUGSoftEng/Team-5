/* file: learning.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 5/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the learning app.
 */

define(['jquery', 'bootstrap', 'app/database', 'app/messages', 'app/question', 'app/timer'], function ($, bootstrap, db, messages, question, timer) {
  timer.startTimer(600); // TODO: Magic number 600; in the future, user will choose time in main menu.

  // Disable autocomplete that provides suggestions when typing words
  $('input').attr('autocomplete', 'off');

  $(document).ready(function() {
  	question.show();
  });

  // Temporary hint button
  $("#hintButton").click(function() {
    messages.showHint('This is a very handy hint to answer this question that you see above.');
  });

  // Read the user input when the Enter key is pressed and evaluate it.
  // Then show the next question.
  $("form").bind("keypress", function (e) {
  	if (e.keyCode == 13) {
  		question.checkAnswer();
  		question.show();
  	}
  });
});
