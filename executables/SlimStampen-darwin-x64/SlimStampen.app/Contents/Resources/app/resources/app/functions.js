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
  $("#show").removeClass("alert-success").removeClass("alert-danger").removeClass("alert-warning").addClass("alert-"+type);
  $("#show .icon .glyphicon").removeClass("glyphicon-ok-sign glyphicon-remove-sign glyphicon-exclamation-sign")
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

/* Functions showHint, showProgress and showQuestion are used to update the hint,
 * the progress bar and the question box respectively.
 */

  function showHint(message) {
    $("#hint").show();
    $("#hint .message").html(message);
  }

  function showProgress() {
  	$( "#progress-number" ).html( "<p>" + (TOTAL_LENGTH - items.length) + "/" + TOTAL_LENGTH + " words</p>" );
  	var percentage = Math.round((TOTAL_LENGTH - items.length) / TOTAL_LENGTH * 100);
  	$( "#progress-bar" ).html(percentage + "%").attr("aria-valuenow", percentage).css("width", percentage+"%");
  }

  function showQuestion() {
  	var question = items[i].question

  	if (inTutorial) {
  		question += "<br><b>Type the answer:</b> " + items[i].answer;
  	}

  	$( "#question" ).html( question );
  }

/* Check answer checks the provided answer of the user. When the levenshtein
 * difference is equal to zero than the answer is correct. When the difference
 * is smaller that the allowed margin of error, then the user gets the feedback
 * that it was almost correct.
 */

 function checkAnswer() {
 	var input = document.getElementById("answer").value;
 	var answer = items[i].answer;

 	var difference = levenshtein(input,answer);
 	if (difference == 0) {
 		show( "Well done!", "success" );
 		if (!inTutorial) {
 			items.splice(i,1);
 			i %= items.length;
 		} else {
 			i++;
 		}
 	} else if (difference <= (answer.length * ALLOWED_MARGIN_OF_ERROR)) {
 		show( "Almost there! Your answer: " + input + " - Expected answer: " + answer + " (" + difference + " letter(s) difference)", "warning");
 		i = (i + 1) % items.length;
 	} else {
 		show( "Wrong answer! Expected answer: " + answer , "danger");
 		i = (i + 1) % items.length;
 	}

 	$( "#answer" ).val( "" );

 	showProgress();

 	if (items.length == 0) {
 		alert("Done!");
 	}
 }

/* Timer functions that initiates and updates the timer. TimeFormat makes sure
 * that time below 10 is always displayed with an extra preceding 0.
 */

function timeFormat(time) {
  return time < 10 ? "0"+time : time;
}

function startTimer(max_seconds) {
  timer = setInterval(function() { updateTimer(max_seconds); }, 1000);
  minutes = Math.floor(max_seconds/60);
  seconds = max_seconds%60;
  $(".timer .max").html(timeFormat(minutes)+":"+timeFormat(seconds));
  $(".timer .current").html("00:00");
}

function updateTimer(max_seconds) {
  currentTime = $(".timer .current").data("seconds");
  currentTime++;
  $(".timer .current").data("seconds", currentTime);
  minutes = Math.floor(currentTime/60);
  seconds = currentTime%60;
  $(".timer .current").html(timeFormat(minutes)+":"+timeFormat(seconds));
  if (currentTime>=max_seconds) {
    clearInterval(timer);
    show("You have run out of time!", 'danger');
    $('.timer').css("color", "red");
  }
}

/* levenshtein determines the amount of characters that are different between
 * two strings.
 */

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
