// Start loading the main app file. Put all of
// your application logic in there.

//Load common code that includes config, then load the app logic for this page.
requirejs(['./app'], function (app) {
  requirejs(['./app/learning']);
});
