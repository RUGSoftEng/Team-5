/* file: functions.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 28/02/2016
 * version 1.0
 *
 * Description:
 * List of all functions that are being used in the program. This list will be
 * later split into seperate files.
 */

/* Function show for displaying normal, danger and warning messages.
 * The message is included as html and a class with the corresponding type is
 * added. Within the switch statement the icon is added.
 */

 function show(message, type) {
   $("#show .message").html(message);

   $("#show").removeClass("alert-success alert-danger alert-warning");
   $("#show").addClass("alert-"+type);

   $("#show .icon .glyphicon").removeClass("glyphicon-ok-sign glyphicon-remove-sign glyphicon-exclamation-sign");

   switch (type) {
     case 'success':
       $("#show .icon .glyphicon").addClass("glyphicon-ok-sign");
       break;
     case 'danger':
       $("#show .icon .glyphicon").addClass("glyphicon-remove-sign");
       break;
     case 'warning':
       $("#show .icon .glyphicon").addClass("glyphicon-exclamation-sign");
       break;
     default:
       $("#show .icon .glyphicon").addClass("glyphicon-ok-sign");
       break;
   }
 }

 // Functions showHint, showProgress and showQuestion are used to update the hint,
 // the progress bar and the question box respectively.
 function showHint(message) {
   $("#hint").show();
   $("#hint .message").html(message);
 }

 // TODO: add a hideHint function too (?)

 function showProgress() {
   $( "#progress-number" ).html( "<p>" + (TOTAL_LENGTH - items.length) + "/" + TOTAL_LENGTH + " words</p>" );
   var percentageVal = percentage(TOTAL_LENGTH - items.length, TOTAL_LENGTH);
   $( "#progress-bar" ).html(percentageVal + "%").attr("aria-valuenow", percentageVal).css("width", percentageVal+"%");
 }

 function showQuestion() {
   var question = items[currentItemIndex].question

   if (inTutorial) {
     question += "<br><b>Type the answer:</b> " + items[currentItemIndex].answer;
   }

   $( "#question" ).html( question );
 }

 // Calculate the percentage of 'part out of total'
 function percentage(part, total) {
   return Math.round(part / total * 100);
 }

 // Timer functions that initiates and updates the timer.
 function startTimer(max_seconds) {
   timer = setInterval(function() { updateTimer(max_seconds); }, 1000);
   $(".timer .max").html(timeToString(max_seconds));
   $(".timer .current").html("00:00");
 }

 function updateTimer(max_seconds) {
   currentTime = $(".timer .current").data("seconds");
   currentTime++;
   $(".timer .current").data("seconds", currentTime);
   $(".timer .current").html(timeToString(currentTime));
   if (currentTime>=max_seconds) {
     clearInterval(timer);
     show("You have run out of time!", 'danger');
     $('.timer').css("color", "red");
   }
 }

 // TimeFormat makes sure that time below 10 is always displayed with an extra preceding 0.
 function timeFormat(time) {
   return time < 10 ? "0"+time : time;
 }

 // Create a string representation of time (mm:ss) for easy display
 function timeToString(time) {
   minutes = Math.floor(time/60);
   seconds = time%60;
   return timeFormat(minutes)+":"+timeFormat(seconds);
 }

 /* Check answer checks the provided answer of the user. When the levenshtein
  * difference is equal to zero than the answer is correct. When the difference
  * is smaller that the allowed margin of error, then the user gets the feedback
  * that it was almost correct.
  */
function checkAnswer() {
  console.log("hoi");
   var input = document.getElementById("answer").value;
   var answer = items[currentItemIndex].answer;

   var difference = levenshtein(input,answer);
   if (difference == 0) {
     show( "Well done!", "success" );
     nextQuestion();
   } else if (difference <= (answer.length * ALLOWED_MARGIN_OF_ERROR)) {
     show( "Almost there! Your answer: " + input + " - Expected answer: " + answer + " (" + difference + " letter(s) difference)", "warning");
     currentItemIndex = (currentItemIndex + 1) % items.length;
   } else {
     show( "Wrong answer! Expected answer: " + answer , "danger");
     currentItemIndex = (currentItemIndex + 1) % items.length;
   }

   $( "#answer" ).val( "" );

   showProgress();

   if (items.length == 0) {
     alert("Done!");
   }
  }

 // Handle how to move to the next question
 // depending on the tutorial status.
 function nextQuestion() {
   if (!inTutorial) {
     items.splice(currentItemIndex,1);
     currentItemIndex %= items.length;
   } else {
     currentItemIndex++;
   }
 }

 // Levenshtein determines the amount of characters
 // that are different between two strings.
 function levenshtein(str1, str2) {
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
