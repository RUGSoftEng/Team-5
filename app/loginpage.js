//Load common code that includes config, then load the script needed for login page.

requirejs(['./common'], function (common) {
	requirejs(['./app/login']);
});
