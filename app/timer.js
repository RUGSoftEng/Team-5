define(['jquery'], function($) {
  function updateTimer(max_seconds) {
    currentTime = $(".timer .current").data("seconds");
    currentTime++;
    $(".timer .current").data("seconds", currentTime);
    $(".timer .current").html(timeToString(currentTime));
    if (currentTime>=max_seconds) {
      clearInterval(timer);
      alert("You have run out of time!");
      $('.timer').css("color", "red");
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

  return {
    // Timer functions that initiates and updates the timer.
    startTimer: function(timerid, max_seconds) {
      timer = setInterval(function() { updateTimer(max_seconds); }, 1000);

      $(timerid+" .max").html(timeToString(max_seconds));
      $(timerid+" .current").html("00:00");
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
