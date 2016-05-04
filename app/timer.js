define(['jquery', 'app/lang'], function($, lang) {
  function updateTimer(max_seconds) {
    currentTime = $(".timer .current").data("seconds");
    currentTime++;
    $(".timer .current").data("seconds", currentTime);
    $(".timer .current").html(timeToString(currentTime));
    if (currentTime>=max_seconds) {
      clearInterval(timer);
      alert(lang("learning_timeup"));
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

  // Clear the timer by setting it back to 00:00
  function clearTimer(timerid) {
    $(timerid+" .current").html("00:00");
  }

  return {
    // Timer functions that initiates and updates the timer.
    startTimer: function(timerid, max_seconds) {
      timer = setInterval(function() { updateTimer(max_seconds); }, 1000);
      $(timerid+" .max").html(timeToString(max_seconds));
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
