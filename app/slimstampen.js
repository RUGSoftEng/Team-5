define(['app/config'], function (config) {
  var slimstampen;
  if (config.constant("ALGORITHM")=="slimstampen") {
    requirejs(['slimstampenModel'], function (model) {
        console.log("Slimstampen loaded");
        slimstampen = model;
    }, function (error) {
        console.log("Slimstampen not found: "+error);
        return false;
    });

  }
  return {
    getNextFact: function (currentTime, factList, responseList) {
      return slimstampen.getNextFact(currentTime, factList, responseList);
    }
  };
});
