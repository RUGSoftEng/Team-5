//this Module is responsible for all time related functions.
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
    start: function(){
      return "00:00";
    },
    // Calculate the time difference in milliseconds
    measure: function(start) {
      var end = new Date();
      return end.getTime() - start.getTime();
    },
    // Create a string representation of time (mm:ss) for easy display
    toString: function(time) {
        minutes = Math.floor(time/60);
        seconds = time%60;
        return format(minutes)+":"+format(seconds);
    }
  };
});
