/* file: learning.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 25/3/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the learning app.
 */

/*jshint esversion: 6 */
define(['jquery', 'app/lang', 'app/string', 'bootstrap', 'app/config', 'app/database', 'app/learningMessages', 'app/question', 'app/timer', 'app/ready', 'app/user', 'app/time'], function ($, lang, string, bootstrap, config, db, messages, questions, timer, ready, user, time) {
  var waitingForEnter = false;

  function disableAutocomplete() {
    $('input').attr('autocomplete', 'off');
  }

	function inputIsEmpty() {
		return $.trim($("#answer").val()).length === 0;
	}

  function nextQuestion() {
    clearTimeout(timeout);
    timer.clearCountdown();
    messages.clear();
    questions.nextQuestion();
    $( "#answer" ).prop("disabled", false);
    $( "#answer" ).val( "" );
    $( "#answer" ).focus();
    questions.show();
    waitingForEnter = false;
  }

  function handleEnter() {
    if (waitingForEnter) {
      nextQuestion();
    } else if (!inputIsEmpty()) {
      $( "#answer" ).prop("disabled", true);
      questions.checkAnswer();
      waitingForEnter = true;
      timeout = setTimeout(nextQuestion,time.secondsToMilliseconds( $(".countdown").data("seconds") ) );
    }
  }

  function formatFactList(items) {
    var newList = [];
    items.forEach(function(item) {
      newItem = {
        id: item.item_id,
        text: item.item_question,
        answer: item.item_answer,
        hint: item.item_hint
      };
      newList.push(newItem);
    });
    return newList;
  }

	// Write localisable text to the page
	string.fillinTextClasses();
	$("#answer").prop("placeholder", lang("placeholder_typeanswerhere"));

  disableAutocomplete();

	// Replace user data in view from database
	$("span[data-replace]").each(function() {
		var user_info = $(this).data("replace");
		var text = user.get(user_info);
		$(this).html(text);
	});
	$("span[data-username]").html(user.get("user_firstname")+" "+user.get("user_lastname"));

  // When the page is loaded we get the datasetId from the page url and load the dataset from the database
  ready.on(function() {
    var url = window.location.href;
    var datasetId = url.substring(url.indexOf('?')+1);
    var factList = formatFactList(db.getQuery("getDatasetItems",[datasetId]));
    questions.initialize(factList);
  	questions.show();

    timer.startTimer(".timer", config.constant("TIME_LIMIT"));
  });

  // Temporary hint button
  $("#hintButton").click(function() {
    if (questions.hint()!==null)
      messages.showHint(questions.hint());
  });

  // Read the user input when the Enter key is pressed and evaluate it.
  // Then show the next question.
  $(document).bind("keypress", function (e) {
  	if (e.keyCode == config.key("ENTER")) {
      handleEnter();
  	}
  });
});
