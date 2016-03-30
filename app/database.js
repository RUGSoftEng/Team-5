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

	var sql;

	var queries = {
		addDatasetItem : "INSERT OR IGNORE INTO tblitems (item_dataset,item_question,item_answer,item_hint) VALUES (?, ?, ?, ?)",
		addUserItem : "INSERT OR IGNORE INTO tbluser_items (user_item_id,user_item_user,user_item_strength) VALUES (?, ?, ?)",
		addSubject :  "INSERT OR IGNORE INTO tblusersubjects  (user_id, subject_id, subject_name, VALUES (?, ?, ?)",
		addDataset : "INSERT OR IGNORE INTO tbldatasets  ( dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_date ) VALUES (?, ?, ?, ?, ?, ?, ?)",
		updateDatasetItem : "UPDATE  tbldatasets SET item_dataset = ?, item_question = ?, item_answer = ? , item_hint = ? , WHERE id=?",
		updateItemStrength : "UPDATE  tbluser_items SET user_item_strength= ?  , WHERE id=? ",
		getDatasetItems : "SELECT * FROM tblitems where item_dataset=?" ,
		getUserSubjects : "SELECT * FROM tblsubjects where user_id=? ",
		getUser : "SELECT * FROM tblsubjects where user_id= ? "
	};
	
	// Check if SQL.js has been loaded through AMD
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

	// Function for Handeling query Error
	function onError(db, error) {
		console.log("this error " + error.message);
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
		executeQuery : function (queryname, args) {
			var query = queries[queryname] ;
			db.run(query, args, onError);
		},
		selectDatasetItems :  function (queryname, args) {
			var query = queries[ queryname] ;
			db.each(query,args, function(row, err) {
				console.log(row.item_answer );
			});
		},
		selectUserSubjects :  function (queryname, args) {
			var query = queries[ queryname] ;
			db.each(query,args, function(row, err) {
				console.log(row.subject_name );
			});
		},
		selectUser :  function (queryname, args) {
			var query = queries[ queryname] ;
			db.each(query,args, function(row, err) {
				console.log(row.user_email );
			});
		}

	}
	return database;
});
