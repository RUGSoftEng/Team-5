define([], function () {
  // TimeFormat makes sure that time below 10 is always displayed with an extra preceding 0.
  function format(time) {
      return time < 10 ? "0"+time : time;
  }
  return {
    secondsToMilliseconds: function(time) {
      return time *1000;
    },
    minutesToSeconds: function(time){
      return time*60;
    },
    // Create a string representation of time (mm:ss) for easy display
    toString: function(time) {
        minutes = Math.floor(time/60);
        seconds = time%60;
        return format(minutes)+":"+format(seconds);
    }
  }
});
