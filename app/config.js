/* file: config.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 09/04/2016
 * version 1.2
 *
 * Description:
 * Initialization of variables and constants.
 */
define(function (require) {
	var constants = {
		NUMBER_TUTORIAL_QUESTIONS: 3,
		MARGIN_OF_ERROR: 0.2,
		TUTORIAL_MODE: true,
		TIME_LIMIT: 600,
		FEEDBACK_DELAY_CORRECT: 0.5,
		FEEDBACK_DELAY_INCORRECT: 10,
		DATABASE_USER: __dirname + "/database/user.sqlite",
		DATABASE_SLIMSTAMPEN: __dirname + "/database/slimstampen.sqlite",
		ALGORITHM: "flashcard", // flashcard; slimstampen;
		LANGUAGE: "nl"
	};

	var keys = {
		TAB: 9,
		ENTER: 13
	};

	return {
		constant: function(name) {
			return constants[name];
		},

		key: function(name) {
			return keys[name];
		}
	}
});
