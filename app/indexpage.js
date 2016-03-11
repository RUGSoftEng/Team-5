//Load common code that includes config, then load the app logic for this page.
requirejs(['./app'], function (app) {
    requirejs(['./app/exceltojson']);
});
