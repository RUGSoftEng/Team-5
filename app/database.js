/* file: database.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 13/3/2016
 * version 1.1
 *
 * Description:
 * Module for loading the database. This file contains all the functions that
 * update or retrieve information from the database. The dependancy for this
 * module is sqlite.
 */

define(['sqlite', 'app/config'], function (sqlite, config) {
	// Check if SQL.js has been loaded through AMD
	var sql;
	var queries = [
		"INSERT OR IGNORE INTO tblitems (item_dataset,item_question,item_answer,item_hint) VALUES (?, ?, ?, ?)",
		"INSERT OR IGNORE INTO tbluser_items (item_dataset,item_question,item_answer,item_hint) VALUES (?, ?, ?)",
		"INSERT OR IGNORE INTO tblsubjects  (subject_id, subject_name, VALUES (?, ?)",
		"INSERT OR IGNORE INTO tbldatasets  ( dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_date ) VALUES (?, ?, ?, ?, ?, ?, ?)",	
	];

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
		save : function () {
			var data = db.export();
			var buffer = new Buffer(data);
			fs.writeFileSync(config.constant("DATABASE_USER"), buffer);
		},
		close : function () {
			var data = db.export();
			var buffer = new Buffer(data);
			fs.writeFileSync(config.constant("DATABASE_USER"), buffer);
			console.log("Closed connection");
		},

		excuteQuery : function (query_index, args) {
			var query = queries[query_index];
			db.run(query, args, onError);
		}

	}
	return database;
});
