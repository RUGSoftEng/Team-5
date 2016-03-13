// Start loading the main app file. Put all of
// your application logic in there.

//Load common code that includes config, then load the app logic for this page.
requirejs(['./common'], function (common) {
  requirejs(['./app/learning']);
});
