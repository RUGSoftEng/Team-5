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
    TIME_LIMIT: 600,
    FEEDBACK_DELAY: 10000,
    DATABASE_USER: "./database/user.sqlite",
    DATABASE_SLIMSTAMPEN: "./database/slimstampen.sqlite"
  };

  return {
    constant: function(name) {
      return constants[name];
    }
  }
});
