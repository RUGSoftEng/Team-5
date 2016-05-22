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

define(['sqlite', 'app/config', 'jquery'], function (sqlite, config) {
	var queries = {
		addDatasetItem : "INSERT INTO tblitems (item_dataset_id,item_question,item_answer,item_hint) VALUES (?, ?, ?, ?)",
		addUserItem : "INSERT OR IGNORE INTO tbluser_items (user_item_id,user_item_user,user_item_strength) VALUES (?, ?, ?)",
		addModule :  "INSERT OR IGNORE INTO tblusersubjects  (user_id, subject_id, subject_name, VALUES (?, ?, ?)",
		addDataset : "INSERT OR IGNORE INTO tbldatasets  (dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_date, dataset_lastedited ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		addSubject : "INSERT OR IGNORE INTO tblsubjects (subject_id, subject_name) VALUES (?, ?)",
    addUser:  "INSERT INTO tblusers  (user_email, user_name, user_gender, user_bday, user_password, user_firstname, user_lastname, user_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		updateDatasetItem : "UPDATE  tbldatasets SET item_dataset = ?, item_question = ?, item_answer = ? , item_hint = ? , WHERE id=?",
		updateItemStrength : "UPDATE  tbluser_items SET user_item_strength= ?  , WHERE id=? ",
		updateGUILanguage : "UPDATE tblusers SET user_language = ? WHERE user_id = ?",
		getDatasets : "SELECT * FROM tbldatasets WHERE dataset_language=? AND dataset_subject=?",
    getDatasetByName : "SELECT * FROM tbldatasets WHERE dataset_name=?",
		getDatasetItems : "SELECT * FROM tblitems WHERE item_dataset_id=?" ,
		getGUILanguages : "SELECT * FROM tbllanguages WHERE language_gui = 1",
		getUserSubjects : "SELECT * FROM tblsubjects",
    getUser : "SELECT * FROM tblusers WHERE user_id= ? ",
    getUserbyEmail : "SELECT * FROM tblusers WHERE user_email= ?",
    getUserbyUsername : "SELECT * FROM tblusers WHERE user_name= ?",
		getUserIdbyUsername : "SELECT user_id, user_password FROM tblusers WHERE user_name=?",
		getUserIdbyEmail : "SELECT user_id FROM tblusers WHERE user_email=?",
    getLanguages: "SELECT * FROM tbllanguages",
		getModules: "SELECT language_id, language_name, subject_id, subject_name FROM tbldatasets,tbllanguages,tblsubjects WHERE dataset_language=language_id AND dataset_subject=subject_id",
		getSubjectByName : "SELECT * FROM tblsubjects WHERE subject_name=?"
	};

	// Check if SQL.js has been loaded through AMD
	var sql;
	if (typeof sqlite !== 'object') {
		document.body.style.backgroundColor = 'red';
		alert("Failed to require sql.js through AMD.");
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
		alert('Something went wrong while excuting your request\n please try again! ');
	}
	
	// Auxiluary uniqueness function
  function isUnique(unique_name1, unique_name2, queryResult, row) {
    for (i = 0; i<queryResult.length;i++) {
      if (queryResult[i][unique_name1]==row[unique_name1] && queryResult[i][unique_name2]==row[unique_name2]) {
        return false;
      }
    }
    return true;
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
			db.run(query, args, function(e,d) {
				console.log(e);
				console.log(d);
			});
		},
		getQuery: function(queryname,args){
			var queryResult = [];
			var query = queries[queryname];
			db.each(query,args, function(row, err) {
				queryResult.push(row);
			});
			return queryResult;
		},
		getUnique: function(queryname, unique_name1, unique_name2, args) {
			var queryResult = [];
			var query = queries[queryname] ;
			db.each(query,args, function(row, err) {
				if (isUnique(unique_name1, unique_name2, queryResult, row))
					queryResult.push(row);
			});
			return queryResult;
		},
		lastInsertRowId: function(table,row_id) {
			var query = "SELECT "+row_id+" FROM "+table+ " ORDER BY "+row_id+ " DESC LIMIT 1";
			db.each(query,"", function(row, err) {
				queryResult = row[row_id];
			});
			return queryResult;
		},
		each : function(queryname, args, func) {
			var query = queries[queryname];
			db.each(query,args, func);
		}
	};
	return database;
});
