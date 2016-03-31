define(['app/messages', 'app/config'], function (messages,config) {
  var currentItemIndex = 0;
  var inTutorial = config.constant("TUTORIAL_MODE");
  var items = config.items();

  // Calculate the percentage of 'part out of total'
  function percentage(part, total) {
   return Math.round(part / total * 100);
  }

  // Check whether the user is in tutorial mode.
  // If the user leaves tutorial mode, roll back to the first item.
  function checkTutorialStatus() {
    if (inTutorial && config.constant("TUTORIAL_MODE")) {
      if (currentItemIndex == config.constant("NUMBER_TUTORIAL_QUESTIONS")) {
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
    requirejs(['jquery'], function( $ ) {
      $( "#progress-number" ).html( "<p>" + (config.constant("TOTAL_LENGTH") - items.length) + "/" + config.constant("TOTAL_LENGTH") + " words</p>" );
      var percentageVal = percentage(config.constant("TOTAL_LENGTH") - items.length, config.constant("TOTAL_LENGTH"));
      $( "#progress-bar" ).html(percentageVal + "%").attr("aria-valuenow", percentageVal).css("width", percentageVal+"%");
    });
  }

  // Handle how to move to the next question
  // depending on the tutorial status.
  function nextQuestion() {
    if (!inTutorial) {
      items.splice(currentItemIndex,1);
      currentItemIndex %= items.length;
    } else {
      currentItemIndex++;
      inTutorial = checkTutorialStatus();
    }
  }

  return {
    show: function() {
      var question = items[currentItemIndex].question;

      if (inTutorial) {
        question += "<br><b>Type the answer:</b> " + items[currentItemIndex].answer;
      }

      showProgress();
      requirejs(['jquery'], function( $ ) {
        $( "#question" ).html( question );
      });
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

      if (difference == 0) {
        messages.show( "Well done!", "success" );
        nextQuestion();
      } else if (difference <= (answer.length * config.constant("MARGIN_OF_ERROR"))) {
        messages.show( "Almost there! Your answer: " + input + " - Expected answer: " + answer + " (" + difference + " letter(s) difference)", "warning");
        currentItemIndex = (currentItemIndex + 1) % items.length;
      } else {
        messages.show( "Wrong answer! Expected answer: " + answer , "danger");
        currentItemIndex = (currentItemIndex + 1) % items.length;
      }
      requirejs(['jquery'], function( $ ) {
        $( "#answer" ).val( "" );
      });
      showProgress();

      if (items.length == 0) {
        alert("Done!");
      }
    }
  }
});
