define(['jquery', 'app/learningMessages', 'app/config', 'app/string', 'app/slimstampen','app/time', 'app/math', 'app/lang', 'app/keys','app/ready','app/database'], function ($, messages, config, string, slimstampen,time,math, lang, keys,ready,db) {
  var items;
  var currentItemIndex = 0;
  var totalLength;
  var backspaceUsed=0;
  var backspacedFirstLetter=0;
  var keyPressesCounter = 0;
  var itemsAnsweredCorrectly = 0;
  var answerWasCorrect;
  var timeCreated = 0;
  var correctAnswers = 0;
  var totalAnswers = 0;
  var tutorialLength;
  var inTutorial = config.constant("TUTORIAL_MODE");
  var startTime = new Date();
  var firstKeyPress = 0;
	var presentationDuration = 0;
  var responseList ;

  // Calculate the time difference in milliseconds
  function measureTime(start) {
    var end = new Date();
    return end.getTime() - start.getTime();
  }

  // Check whether the user is in tutorial mode.
  // If the user leaves tutorial mode, roll back to the first item.
  function checkTutorialStatus() {
    if (inTutorial && config.constant("ALGORITHM")!=="slimstampen") {
      if (currentItemIndex == tutorialLength) {
        currentItemIndex = 0;
      } else {
        return true;
      }
    }
    return false;
  }

  // Levenshtein determines the amount of characters
  // that are different between two strings.
  function levenstein(str1, str2) {
   str1 = str1.toLowerCase();
   str2 = str2.toLowerCase();
     var m = str1.length,
         n = str2.length,
         d = [],
         i, j;

     if (!m) return n;
     if (!n) return m;

     for (i = 0; i <= m; i++) d[i] = [i];
     for (j = 0; j <= n; j++) d[0][j] = j;

     for (j = 1; j <= n; j++) {
         for (i = 1; i <= m; i++) {
             if (str1[i-1] == str2[j-1]) d[i][j] = d[i - 1][j - 1];
             else d[i][j] = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1;
         }
     }
     return d[m][n];
  }
	
	function strengthColour(percentage) {
		if (percentage < config.constant("STRENGTH_RED_UPPERLIMIT")) {
			return "danger";		// red
		} else if (percentage >= config.constant("STRENGTH_GREEN_LOWERLIMIT")) {
			return "success";		// green
		} else {
			return "warning";		// yellow
		}
	}
	
  function showProgress() {
    $( "#progress-number" ).html( "<p>" + correctAnswers + "/" + totalAnswers + " " + lang("general_words") + "</p>" );
    var percentageVal = math.percentage(correctAnswers, totalAnswers);
		var colour = strengthColour(percentageVal);
    $( "#progress-bar" ).html(percentageVal + "%")
      .attr("aria-valuenow", percentageVal)
      .css("width", percentageVal+"%")
			.removeClass("progress-bar-success")
			.removeClass("progress-bar-warning")
			.removeClass("progress-bar-danger")
			.addClass("progress-bar-" + colour);
  }

  function isWithinMarginOfError(answer, difference) {
    return difference <= (answer.length * config.constant("MARGIN_OF_ERROR"));
  }

  // Handle how to move to the next question
  // depending on the tutorial status and algorithm.
  function nextQuestion() {
    console.log('next question')
    switch(config.constant("ALGORITHM")) {
      case "flashcard":
        nextQuestionFlashcard();
        break;
      case "slimstampen":
        nextQuestionSlimStampen();
        break;
    }
    timeCreated = time.measure(startTime);
  }

  function showTutorialInstruction() {
    $("#question").append("<br>" + lang("tutorial_typeanswer", items[currentItemIndex].answer));
  }

  function handleScoreIncrease() {
    if (!inTutorial) {
      itemsAnsweredCorrectly++;
    }
    showProgress();
		
    if (itemsAnsweredCorrectly == totalLength && config.constant("ALGORITHM")=="flashcard") {
      alert(lang("learning_done"));
      window.location = 'index.html';
    }
  }

  function constructMessage(type,answer,difference){
  var message;
    switch(type){
      case 'success':
          message =  lang("answer_correct");
          break;
      case 'warning':
          message =  lang("answer_almost", answer, difference);
          break;
      case 'danger':
          message =  lang("answer_wrong", answer);
          break;
      default:
          message = '';
    }
    return message;
  }

  // Use flaschcard method to determine next question
  function nextQuestionFlashcard(){
    if (inTutorial) {
      currentItemIndex++;
      inTutorial = checkTutorialStatus();
    } else if (answerWasCorrect) {
      items.splice(currentItemIndex, 1);
      currentItemIndex %= items.length;
    } else {
      currentItemIndex = (currentItemIndex + 1) % items.length;
    }
  }

  // Update the response list in order to determine next question
  function nextQuestionSlimStampen(){
    console.log(responseList);
		responseInput = {
			presentationStartTime: timeCreated,
			reactionTime: firstKeyPress,
			presentationDuration: presentationDuration,
			factId: items[currentItemIndex].id,
			correct: answerWasCorrect,
			givenResponse: items[currentItemIndex].answer,
			numberOfOptions: 0,
			backspaceUsed: backspaceUsed,
			backspacedFirstLetter: backspacedFirstLetter,
		};

		newResponse = slimstampen.createResponse(items, responseList, responseInput)
		responseList.push(newResponse);
    resetTimers();
		// Use slimstampen method to determine next question
		var newQuestion = slimstampen.getNextFact(timeCreated, items, responseList);
		currentItemIndex = items.indexOf(newQuestion);


  }

  function  isAlphanumeric(key){
    return key >= config.constant("0") && key <= config.constant("z");
  }

	$('#answer').on('keyup', function(e) {
    keyPressesCounter++;
    backspaceUsed = (e.keyCode === keys.BACKSPACE);
    backspacedFirstLetter = (e.keyCode=== keys.BACKSPACE && keyPressesCounter===2);

		if (firstKeyPress===0 && e.keyCode !== keys.ENTER) {
			start = startTime.getTime() + timeCreated;
			firstKeyPress = time.measureWithoutDate(start);
      keyPressesCounter = 1;
		}
	});

  function resetTimers() {
    firstKeyPress = 0;
    presentationDuration = 0;
    backspaceUsed = 0;
    backspacedFirstLetter = 0;
  }

  return {
    initialize: function(factList, responselist) {

        if(config.constant('ALGORITHM') === 'slimstampen'){
          responseList = responselist;
        }

        items = factList;
        totalLength = items.length;
        tutorialLength = Math.min(totalLength, config.constant("NUMBER_TUTORIAL_QUESTIONS"));
        timeCreated = time.measure(startTime);

        window.onkeyup = function(e) {
          // Measure first key press if a letter or number was pressed
          if (!firstKeyPress && isAlphanumeric(e.keyCode)) {
            firstKeyPress = time.measure(startTime);
          }
        };
    },

    show: function() {
      showProgress();
      $("#question").html(items[currentItemIndex].text);

      if (checkTutorialStatus()) {
        showTutorialInstruction();
      }
    },

    checkAnswer: function() {
      /* Check answer checks the provided answer of the user. When the levenshtein
      * difference is equal to zero than the answer is correct. When the difference
      * is smaller that the allowed margin of error, then the user gets the feedback
      * that it was almost correct.
      */

      var input = document.getElementById("answer").value;
      var answer = items[currentItemIndex].answer;
      var difference = levenstein(input,answer);
      answerWasCorrect = (difference === 0);
      totalAnswers++;

      if (answerWasCorrect) {
        correctAnswers++;
        handleScoreIncrease();
        messages.show( constructMessage('success',answer,difference), 'success', config.constant("FEEDBACK_DELAY_CORRECT") );
      } else if (isWithinMarginOfError(answer, difference)) {
				showProgress();
        messages.show( constructMessage('warning',answer, difference), 'warning', config.constant("FEEDBACK_DELAY_INCORRECT") );
      } else {
				showProgress();
        messages.show( constructMessage('danger',answer,difference), 'danger', config.constant("FEEDBACK_DELAY_INCORRECT") );
      }
    },

    nextQuestion: function() {
      nextQuestion();
    },

    hint: function() {
        return items[currentItemIndex].hint;
    },

    calculatePresentationDuration(){
      start = startTime.getTime() + timeCreated;
      presentationDuration = time.measureWithoutDate(start);
    },
    getResponseList: function(){
      return responseList;
    }
  };
});
