/* file: learning.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 25/3/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the learning app.
 */

define(['jquery', 'bootstrap', 'app/config', 'app/database', 'app/messages', 'app/question', 'app/timer','app/database'], function ($, bootstrap, config, db, messages, question, timer,db) {
  timer.startTimer(".timer", config.constant("TIME_LIMIT"));
  var waitingForEnter = false;
  
  function disableAutocomplete() {
    $('input').attr('autocomplete', 'off');
  }
  
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
  
  function handleEnter() {
    if (waitingForEnter) {
      nextQuestion();
    } else {
      $( "#answer" ).prop("disabled", true);
      question.checkAnswer();
      waitingForEnter = true;
      timeout = setTimeout(nextQuestion, config.constant("FEEDBACK_DELAY"));
    }
  }

  disableAutocomplete();
  
  // When the page is loaded we get the datasetId from the page url and load the dataset from the databese
  $(document).ready(function() {
    var url =   window.location.href
    var datasetId = url.substring(url.indexOf('?')+1);
    var datasetItems = db.getQuery("getDatasetItems",[datasetId]);
    question.initialise(datasetItems);
  	question.show();
  });

  // Temporary hint button
  $("#hintButton").click(function() {
    if (question.hint()!=="")
      messages.showHint(question.hint());
  });

  // Read the user input when the Enter key is pressed and evaluate it.
  // Then show the next question.
  $(document).bind("keypress", function (e) {
  	if (e.keyCode == config.key("ENTER")) {
      handleEnter();
  	}
  });
});
