
define(['jquery'], function($) {
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

  return {
    // Timer functions that initiates and updates the timer.
    startTimer: function(max_seconds) {
      timer = setInterval(function() { updateTimer(max_seconds); }, 1000);

        $(".timer .max").html(timeToString(max_seconds));
        $(".timer .current").html("00:00");

    }
  }
});
