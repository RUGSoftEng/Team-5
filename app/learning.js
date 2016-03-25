/* file: learning.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 25/3/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the learning app.
 */

define(['jquery', 'bootstrap', 'app/config', 'app/database', 'app/messages', 'app/question', 'app/timer'], function ($, bootstrap, config, db, messages, question, timer) {
  timer.startTimer(".timer", config.constant("TIME_LIMIT"));
  var waitingForEnter = false;

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
  $(document).bind("keypress", function (e) {
  	if (e.keyCode == 13) {
      if (waitingForEnter) {
        nextQuestion();
      } else {
        $( "#answer" ).prop("disabled", true);
        question.checkAnswer();
        waitingForEnter = true;
        timeout = setTimeout(nextQuestion, config.constant("FEEDBACK_DELAY"));
      }
  	}
  });
  
  function nextQuestion() {
    clearTimeout(timeout);
    timer.clearCountdown();
    messages.clear();
    $( "#answer" ).prop("disabled", false);
    $( "#answer" ).val( "" );
    $( "#answer" ).focus();
    question.show();
    waitingForEnter = false;
  }
});
