//This module is for math calculations
define([], function () {
    return {
      // Calculate the percentage of 'part out of total'
      percentage function (part, total) {
       return Math.round(part / total * 100);
      }

    }
});
