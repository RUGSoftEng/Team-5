/* file: learning.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 25/3/2016
 * version 1.2
 *
 * Description:
 * Main script for initiating the learning app.
 */

/*jshint esversion: 6 */
define(['jquery', 'app/lang', 'app/string', 'bootstrap', 'app/config', 'app/database', 'app/learningMessages', 'app/question', 'app/timer', 'app/ready', 'app/user', 'app/time', 'app/keys', 'app/date'], function ($, lang, string, bootstrap, config, db, messages, questions, timer, ready, user, time, keys, date) {
  var waitingForEnter = false;
	var dataset_subject;
	var dataset_language;

  function disableAutocomplete() {
    $('input').attr('autocomplete', 'off');
  }

	function inputIsEmpty() {
		return $.trim($("#answer").val()).length === 0;
	}

	function prepareAnswerField() {
	  $( "#answer" ).prop("disabled", false);
    $( "#answer" ).val( "" );
    $( "#answer" ).focus();
  }

  function nextQuestion() {
    clearTimeout(timeout);
    timer.clearCountdown();
    messages.clear();
    questions.nextQuestion();
    prepareAnswerField();
    questions.show();
    waitingForEnter = false;
  }

  function handleEnter() {
    if (waitingForEnter) {
      nextQuestion();
    } else if (!inputIsEmpty()) {
      questions.calculatePresentationDuration();
      $( "#answer" ).prop("disabled", true);
      questions.checkAnswer();
      waitingForEnter = true;
      timeout = setTimeout(nextQuestion,time.secondsToMilliseconds( $(".countdown").data("seconds") ) );
    }
  }

  function formatFactList(items) {
    var newList = [];
    for (var i in items) {
      newItem = {
        id: items[i].id,
        text: items[i].text,
        answer: items[i].answer,
        hint: items[i].hint
      };
      newList.push(newItem);
    }
    return newList;
  }

	// Function for obtaining the GET data from the url
  function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp(q+'=([^&]*)','i');
    return (s=s.replace(/^\?/,'&').match(re)) ?s=s[1] :s='';
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

  function getDatasetIdFromURL(url) {
    var datasetId = url.substring(url.indexOf('?')+1);
    return datasetId;
	}

	function retrieveDataSet(datasetId) {
    var factList = formatFactList(db.getQuery("getDatasetItems",[datasetId]));
    return factList;
	}

	function addTemporaryHintButton() {
    if (questions.hint()==="" || questions.hint()===undefined) {
      $("#hintButton").hide();
    } else {
      $("#hintButton").click(function() {
          messages.showHint(questions.hint());
  	  });
    }
	}

  function updateResponseList(dataset_items,datasetId){
    var responseList = questions.getResponseList();
    if(responseList.length>0){
      var currentdate = date.formatDatetime(new Date(), true);
      var newResponse = JSON.stringify(responseList);
      db.executeQuery('updateDatasetResponseList', [responseList, currentdate, datasetId]);
      db.close();
    }
    window.location = "index.html?language="+dataset_language+"&subject="+dataset_subject;
  }

  ready.on(function() {
    var url = window.location.href;
    var datasetId = $_GET('id');
    var dataset_items = db.getQuery("getDatasetById",[datasetId]);
		dataset_subject = dataset_items[0].dataset_subject;
		dataset_language = dataset_items[0].dataset_language;
		questions.setMetaInfo(dataset_subject, dataset_language);
    var factList = formatFactList(JSON.parse(dataset_items[0].dataset_items));
    var responseList = JSON.parse(dataset_items[0].dataset_responselist);
    questions.initialize(factList,responseList);
  	questions.show();

    addTemporaryHintButton();
    startTimer(dataset_items,datasetId);
    $("#quit_session").click(function() {
      if(config.constant('ALGORITHM') === 'slimstampen'){
        updateResponseList(dataset_items,datasetId);
      } else {
				window.location = "index.html?language="+dataset_language+"&subject="+dataset_subject;
			}
    });
  });

  function startTimer(dataset_items,datasetId){
    timer.startTimer(".timer", $_GET('timelimit'), function(){
      alert(lang('learning_timeup'));
      $('.timer').css("color", "red");
      if(config.constant('ALGORITHM') === 'slimstampen'){
        updateResponseList(dataset_items,datasetId);
      }else{
        window.location = "index.html?language="+dataset_language+"&subject="+dataset_subject;
      }

    });
  }

  // Read the user input when the Enter key is pressed and evaluate it.
  // Then show the next question.
  $(document).bind("keypress", function (e) {
  	if (e.keyCode == keys.ENTER) {
      handleEnter();
  	}
  });
});
