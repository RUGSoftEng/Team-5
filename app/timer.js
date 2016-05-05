define(['jquery','app/time'], function($,time) {
  function updateTimer(max_seconds) {
    currentTime = $(".timer .current").data("seconds");
    currentTime++;
    $(".timer .current").data("seconds", currentTime);
    $(".timer .current").html(time.toString(currentTime));
    if (currentTime>=max_seconds) {
      clearInterval(timer);
      alert("You are done with this session!");
      $('.timer').css("color", "red");
      window.location = 'index.html';
    }
  }

  function updateCountdown(timerid) {
    currentTime = $(timerid).data("seconds");
    currentTime--;
    $(timerid).data("seconds", currentTime);
    $(timerid).html(currentTime);
    if (currentTime == 0) {
      clearInterval(countdown);
    }
  }

  // Clear the timer by setting it back to 00:00
  function clearTimer(timerid) {
    $(timerid+" .current").html("00:00");
  }

  return {
    // Timer functions that initiates and updates the timer.
    startTimer: function(timerid, max_seconds) {
      timer = setInterval(function() { updateTimer(max_seconds); }, 1000);
      $(timerid+" .max").html(time.toString(max_seconds));
      clearTimer(timerid);
    },

    startCountdown: function(timerid, seconds) {
      countdown = setInterval(function() { updateCountdown(timerid); }, 1000);

      $(timerid).html(seconds);
    },

    clearCountdown: function() {
      clearInterval(countdown);
    }
  }
});
