/* file: config.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 09/04/2016
 * version 1.2
 *
 * Description:
 * Initialization of variables and constants.
 */
define(function (require) {

	function addDirectory() {
		if (__dirname.indexOf("app.asar")!==-1) {
			return directoryCompiledProgram();
		} else {
			return directoryLocalProgram();
		}
	}

	function directoryLocalProgram() {
		return __dirname;
	}

	function directoryCompiledProgram() {
		return __dirname.replace("app.asar", "app.asar.unpacked");
	}

	var constants = {
		NUMBER_TUTORIAL_QUESTIONS: 3,
		/* Margin of error accepted by the Levenstein function */
		MARGIN_OF_ERROR: 0.2,
		TUTORIAL_MODE: true,
		/* Time limit for learning sessions in seconds */
		TIME_LIMIT: 600,
		/* Time before the next item is presented while learning */
		FEEDBACK_DELAY_CORRECT: 1,
		FEEDBACK_DELAY_INCORRECT: 10,
		/* Path to user database */
		DATABASE_USER: addDirectory() + "/database/user.sqlite",
		/* Standard database when no user database is present */
		DATABASE_SLIMSTAMPEN: addDirectory() + "/database/slimstampen.sqlite",
		ALGORITHM: "flashcard", // flashcard; slimstampen;
		LANGUAGE: "en",
		ONLINE_HOST: "db4free.net",
		ONLINE_USER: "enricdz148_slim",
		ONLINE_DATABASE: "enricdz148_slim",
		ONLINE_PASSWORD: "exVhqZJas",
		MESSAGES: "#messages",
		ERRORS: "#errors"
	};

	return {
		constant: function(name) {
			return constants[name];
		}
	};
});
