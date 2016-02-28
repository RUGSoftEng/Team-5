
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
  }
}

function showHint(message) {
  $("#hint").show();
  $("#hint .message").html(message);
}

function startTimer(max_minutes) {
  timer = setInterval(function() { updateTimer(max_minutes); }, 1000);
  minutes = Math.floor(max_minutes/60);
  seconds = max_minutes%60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  $(".timer .max").html(minutes+":"+seconds);
  $(".timer .current").html("00:00");
}

function updateTimer(max_minutes) {
  currentTime = $(".timer .current").data("seconds");
  currentTime++;
  $(".timer .current").data("seconds", currentTime);
  minutes = Math.floor(currentTime/60);
  seconds = currentTime%60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  $(".timer .current").html(minutes+":"+seconds);
  if (currentTime>=max_minutes) {
    clearInterval(timer);
    show("You have run out of time!", 'danger');
    $('.timer').css("color", "red");
  }
}

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
