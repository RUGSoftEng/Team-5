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

var mysql = require('mysql');

define(['sqlite', 'app/config', 'jquery', 'app/lang'], function (sqlite, config, lang) {
	var queries = {
		addDatasetItem : "INSERT INTO tblitems (item_dataset_id,item_question,item_answer,item_hint) VALUES (?, ?, ?, ?)",
		addUserItem : "INSERT OR IGNORE INTO tbluser_items (user_item_id,user_item_user,user_item_strength) VALUES (?, ?, ?)",
		addModule :  "INSERT OR IGNORE INTO tblusersubjects  (user_id, subject_id, subject_name, VALUES (?, ?, ?)",
		addDataset : "INSERT INTO tbldatasets  (dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_date, dataset_lastedited ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    addUser:  "INSERT INTO tblusers  (user_email, user_name, user_gender, user_bday, user_password, user_firstname, user_lastname,'user_createdate','user_lastedited') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		addUserOffline:  "INSERT INTO tblusers  (user_id,user_email, user_name, user_gender, user_bday, user_password, user_firstname, user_lastname,'user_createdate','user_lastedited') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		updateDatasetItem : "UPDATE  tbldatasets SET item_dataset = ?, item_question = ?, item_answer = ? , item_hint = ? , WHERE id=?",
		updateItemStrength : "UPDATE  tbluser_items SET user_item_strength= ?  , WHERE id=? ",
		getDatasets : "SELECT * FROM tbldatasets WHERE dataset_language=? AND dataset_subject=?",
		getUserDatasets : "SELECT * FROM tbldatasets WHERE dataset_user=?",
		getRecentDataset : "SELECT * FROM tbldatasets WHERE dataset_id=? AND ? > ?",
    getDatasetByName : "SELECT * FROM tbldatasets WHERE dataset_name=?",
		getDatasetItems : "SELECT * FROM tblitems WHERE item_dataset_id=?" ,
		getUserSubjects : "SELECT * FROM tblsubjects",
    getUser : "SELECT * FROM tblsubjects where user_id= ? ",
    getUserbyEmail : "SELECT * FROM tblusers where user_email= ?",
    getUserbyUsername : "SELECT * FROM tblusers where user_name= ?",
		getUserIdbyUsername : "SELECT user_id, user_password FROM tblusers WHERE user_name=?",
		getUserIdbyEmail : "SELECT user_id FROM tblusers WHERE user_email=?",
    getLanguages: "SELECT * FROM tbllanguages",
		getModules: "SELECT language_id, language_name, subject_id, subject_name FROM tbldatasets,tbllanguages,tblsubjects WHERE dataset_language=language_id AND dataset_subject=subject_id",
		deleteDatasetbyId: "DELETE FROM tbldatasets WHERE dataset_id= ?"
	};

	// Check if SQL.js has been loaded through AMD
	var sql,db,db_online;
	if (typeof sqlite !== 'object') {
		document.body.style.backgroundColor = 'red';
		alert(lang("error_requirefail", "sql.js"));
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
	db = new sql.Database(read_database);

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
		alert('Something went wrong while excuting your request\n please try again! ')
	}

  // Auxiluary uniqueness function
  function isUnique(unique_name, queryResult, row) {
    for (i = 0; i<queryResult.length;i++) {
      if (queryResult[i][unique_name]==row[unique_name]) {
        return false;
      }
    }
    return true;
  }

	// Auxiluary uniqueness function
  function isUnique2(unique_name1, unique_name2, queryResult, row) {
    for (i = 0; i<queryResult.length;i++) {
      if (queryResult[i][unique_name1]==row[unique_name1] && queryResult[i][unique_name2]==row[unique_name2]) {
        return false;
      }
    }
    return true;
  }

	function synchronizeDatasets(userId){
			var localdatasets = database.getQuery('getUserDatasets',[userId]);
			var remotedatasets = onlineQuery('getUserDatasets',[userId]);
			console.log(localdatasets);
			console.log(remotedatasets);
			for(var i=0; i< localdatasets.length; i++){
				for(var j=0 ;j<remotedatasets; j++){
					if(localdatasets[i].dataset_id === remotedatasets[j].dataset_id){
						synchronizeDataset(localdatasets[i],remotedatasets[i]);
						break;
					}
					if(j === remotedataset.length){
						console.log(remote.dataset_id);
					}
				}
			}
	}

	function sychronizeDataset(local,remote){
		var recent = database.getQuery('getRecentDataset',[local.dataset_id,local.dataset_lastedited,remote.dataset_lastedited]).length > 0;
		var old = database.getQuery('getRecentDataset',[local.dataset_id,remote.dataset_lastedited,local.dataset_lastedited]).length > 0;
		console.log('recent ' +recent);
		console.log('old '+old);
		if(recent){
			databse.executeQuery('deleteDatasetbyId',[local.dataset_id],true,false);
		}else if(old){
			databse.executeQuery('deleteDatasetbyId',[remote.dataset_id],false,true);
		}
	}

	function onlineQuery(queryname,args){
		var queryResult = [];
		var queryString = queries[queryname];
		console.log("here "+queryString);
		db_online.query(queryString,args, function(err, rows, fields) {
	    if (err) throw err;
	    for (var i in rows) {
					queryResult.push(rows[i]);
	        console.log('Post Titles: ', rows[i]);
	    }
		});
		return queryResult;
	}

	var database = {
		online: function() {
					return navigator.onLine;
		},
		init: function() {
			var read_database;
			if (database_exists(config.constant("DATABASE_USER"))) {
				read_database = fs.readFileSync(config.constant("DATABASE_USER"));
			} else {
				read_database = fs.readFileSync(config.constant("DATABASE_SLIMSTAMPEN"));
			}
			db = new sql.Database(read_database);

			if (database.online()) {
				db_online = mysql.createConnection({
					host     : config.constant("ONLINE_HOST"),
					user     : config.constant("ONLINE_USER"),
					password : config.constant("ONLINE_PASSWORD"),
					database : config.constant("ONLINE_DATABASE")
				});

				db_online.connect(function(err) {
					if (err) {
						console.error('Error connecting: ' + err.stack);
						return;
					}
				});
			}
		},
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
		executeQuery : function (queryname, args,local,remote) {
			var query = queries[queryname] ;
				if(local){
				db.run(query, args, function(e,d) {
					console.log(e);
					console.log(d);
				});
			}
			if (remote && database.online()) {
				db_online.query(query, args, function(err, result) {
				  if (err) throw err;
					var insertId = result.insertId;
				});
			}
		},
		getQuery: function(queryname,args){
			var queryResult = [];
			var query = queries[queryname];
			db.each(query,args, function(row, err) {
				queryResult.push(row);
			});
			return queryResult;
		},
		getUnique: function(queryname,unique_name, args) {
			var queryResult = [];
			var query = queries[queryname] ;
			db.each(query,args, function(row, err) {
				if (isUnique(unique_name, queryResult, row))
					queryResult.push(row);
			});
			return queryResult;
		},
		getUnique2: function(queryname, unique_name1, unique_name2, args) {
			var queryResult = [];
			var query = queries[queryname] ;
			db.each(query,args, function(row, err) {
				if (isUnique2(unique_name1, unique_name2, queryResult, row))
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
		},
		synchronize : function(userId){
			synchronizeDatasets(userId);
		},
		getQueryOnline(queryname,args){
			onlineQuery(queryname,args);
		}
	};
	database.init();
	return database;
});
