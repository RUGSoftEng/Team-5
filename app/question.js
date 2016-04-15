define(['jquery', 'app/messages', 'app/config', 'app/string'], function ($, messages, config, string) {
  var items;
  var currentItemIndex = 0;
  var totalLength;
  
  var itemsAnsweredCorrectly = 0;
  var answerWasCorrect;
  
  var tutorialLength;
  var inTutorial = config.constant("TUTORIAL_MODE");

  // Calculate the percentage of 'part out of total'
  function percentage(part, total) {
   return Math.round(part / total * 100);
  }

  // Check whether the user is in tutorial mode.
  // If the user leaves tutorial mode, roll back to the first item.
  function checkTutorialStatus() {
    if (inTutorial) {
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

  function showProgress() {
    $( "#progress-number" ).html( "<p>" + itemsAnsweredCorrectly + "/" + totalLength + " words</p>" );
    var percentageVal = percentage(itemsAnsweredCorrectly, totalLength);
    $( "#progress-bar" ).html(percentageVal + "%").attr("aria-valuenow", percentageVal).css("width", percentageVal+"%");
  }

  function isWithinMarginOfError(answer, difference) {
    return difference <= (answer.length * config.constant("MARGIN_OF_ERROR"));
  }

  // Handle how to move to the next question
  // depending on the tutorial status.
  function nextQuestion() {
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

  function showTutorialInstruction() {
    $("#question").append("<br><b>Type the answer:</b> " + items[currentItemIndex].item_answer);
  }
  
  function handleScoreIncrease() {
    if (!inTutorial) {
      itemsAnsweredCorrectly++;
    }
    showProgress();
    
    if (itemsAnsweredCorrectly == totalLength) {
      alert("Done!");
      window.location = 'index.html';
    }
  }

  return {
    initialise: function(datasetItems) {
        items = datasetItems;
        totalLength = items.length;
        tutorialLength = Math.min(totalLength, config.constant("NUMBER_TUTORIAL_QUESTIONS"));
    },

    show: function() {
      showProgress();
      $("#question").html(items[currentItemIndex].item_question);

      if (inTutorial) {
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
      var answer = items[currentItemIndex].item_answer;

      var difference = levenstein(input,answer);

      if (difference == 0) {
        handleScoreIncrease();
        messages.show( "Well done!", "success", config.constant("FEEDBACK_DELAY") );
      } else if (isWithinMarginOfError(answer, difference)) {
        messages.show( "Almost there! Your answer: " + input + " - Expected answer: " + answer + " (" + difference + " letter" + string.pluralIfAppropriate(difference) + " difference)", "warning", config.constant("FEEDBACK_DELAY") );
      } else {
        messages.show( "Wrong answer! Expected answer: " + answer , "danger", config.constant("FEEDBACK_DELAY") );
      }
      answerWasCorrect = (difference == 0);
    },
    
    nextQuestion: function() {
      nextQuestion();
    },

    hint: function() {
        return items[currentItemIndex].item_hint;
    }
  }
});
