/* file: database.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 19/03/2016
 * version 1.2
 *
 * Description:
 * Module for loading the database. This file contains all the functions that
 * update or retrieve information from the database. The dependancy for this
 * module is sqlite.
 */

define(['sqlite'], function (sqlite) {
	// Check if SQL.js has been loaded through AMD
	var sql;
	if (typeof sqlite !== 'object') {
		document.body.style.backgroundColor = 'red';
		alert("Failed to require sql.js through AMD");
	} else {
		sql = sqlite;
	}

	// Initiate DB and check if there is an existing user DB
	var read_database;
	if (database_exists(config.constant("DATABASE_USER"))) {
		read_database = fs.readFileSync(config.constant("DATABASE_USER"));
	} else {
		read_database = fs.readFileSync(config.constant("DATABASE_SLIMSTAMPEN"));
	}
	var db = new sql.Database(read_database);

  function database_exists(path) {
    try {
      fs.accessSync(path, fs.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

	var database = {
		save:function () {
			var data = db.export();
			var buffer = new Buffer(data);
			fs.writeFileSync(config.constant("DATABASE_USER"), buffer);
		},
		close:function () {
			var data = db.export();
			var buffer = new Buffer(data);
			fs.writeFileSync(config.constant("DATABASE_USER"), buffer);
			console.log("Closed connection");
		}
	}
	return database;
});
