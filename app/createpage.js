//Load common code that includes config, then load the app logic for this page.
requirejs(['./common'], function (common) {
    requirejs(['./app/create', '../lib/include'], callMe);
});

function callMe($, canvas, sub) {
  
}
