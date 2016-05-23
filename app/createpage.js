//Load common code that includes config, then load the script needed for welcome page.

requirejs(['./common'], function (common) {
	requirejs(['./app/create']);
});
