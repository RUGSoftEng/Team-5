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

define(['sqlite', 'app/config', 'jquery', 'app/date', 'app/messages'], function (sqlite, config, $, date, messages) {
	var queries = {
		addDatasetItem : "INSERT INTO tblitems (item_dataset_id,item_question,item_answer,item_hint) VALUES (?, ?, ?, ?)",
		addUserItem : "INSERT OR IGNORE INTO tbluser_items (user_item_id,user_item_user,user_item_strength) VALUES (?, ?, ?)",
		addModule :  "INSERT OR IGNORE INTO tblusersubjects  (user_id, subject_id, subject_name, VALUES (?, ?, ?)",
		addDataset : "INSERT INTO tbldatasets (dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_online, dataset_date, dataset_lastedited, dataset_items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		addDatasetAll: "INSERT INTO tbldatasets (dataset_id, dataset_user, dataset_name, dataset_language, dataset_subject, dataset_official, dataset_published, dataset_online, dataset_date, dataset_lastedited, dataset_items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		addSubject : "INSERT INTO tblsubjects (subject_id, subject_name, subject_user, subject_online) VALUES (?, ?, ?, ?)",
		addSubjectOnline : "INSERT INTO tblsubjects (subject_name, subject_user, subject_online) VALUES (?, ?, ?)",
		addUser:  "INSERT INTO tblusers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		deleteDatasetbyId: "DELETE FROM tbldatasets WHERE dataset_id=?",
		deleteDatasets: "DELETE FROM tbldatasets WHERE 1",
		updateDatasetId : "UPDATE tbldatasets SET dataset_id=?, dataset_online=1 WHERE dataset_id=?",
		updateDatasetSubjectId : "UPDATE tbldatasets SET dataset_subject=? WHERE dataset_subject=?",
		updateItemStrength : "UPDATE  tbluser_items SET user_item_strength=? WHERE id=? ",
		updateGUILanguage : "UPDATE tblusers SET user_language=?, user_lastedited=? WHERE user_id=?",
		updateSubjectId : "UPDATE tblsubjects SET subject_id=?, subject_online=1 WHERE subject_id=?",
		getRecentDataset : "SELECT * FROM tbldatasets WHERE dataset_id=? AND ? > ?",
    getDatasetByName : "SELECT * FROM tbldatasets WHERE dataset_name=?",
		getDatasetItems : "SELECT dataset_items FROM tbldatasets WHERE dataset_id=?" ,
		getGUILanguages : "SELECT * FROM tbllanguages WHERE language_gui=1",
    getUser : "SELECT * FROM tblusers WHERE user_id=? ",
		getUserDatasets : "SELECT * FROM tbldatasets WHERE dataset_user=?",
		getUserDatasetsByModule : "SELECT * FROM tbldatasets WHERE dataset_user=? AND dataset_language=? AND dataset_subject=?",
    getUserbyEmail : "SELECT * FROM tblusers WHERE user_email=?",
    getUserbyUsername : "SELECT * FROM tblusers WHERE user_name=?",
		getUserIdbyUsername : "SELECT user_id, user_password FROM tblusers WHERE user_name=?",
		getUserIdbyEmail : "SELECT user_id FROM tblusers WHERE user_email=?",
		getUserSubjects : "SELECT * FROM tblsubjects WHERE subject_user=0 OR subject_user=?",
    getLanguages: "SELECT * FROM tbllanguages",
		getLanguageByName: "SELECT * FROM tbllanguages WHERE language_short=?",
		getModules: "SELECT language_id, language_name, subject_id, subject_name FROM tbldatasets,tbllanguages,tblsubjects WHERE dataset_language=language_id AND dataset_subject=subject_id AND dataset_user=?",
		replaceUser: "REPLACE INTO tblusers VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		lastInsertedId: "SELECT ? FROM ? ORDER BY ? DESC LIMIT 1",
		getSubjectByName : "SELECT * FROM tblsubjects WHERE subject_name=?"
	};

	var lastId = 0;
	var sql,db,db_online;

	function checkSqlite() {
		if (typeof sqlite !== 'object') {
			messages.show(config.constant("ERRORS"), "Something went wrong, please contact the administrator <strong>"+config.constant("CONTACT")+"</strong> with the following error: <br />Failed to require sqlite through AMD.");
		} else {
			sql = sqlite;
		}
	}

	function database_exists(path) {
		try {
			fs.accessSync(path, fs.F_OK);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	function onError(error) {
		if (error.message !== undefined) {
			messages.show(config.constant("ERRORS"), "Something went wrong, please contact the administrator <strong>"+config.constant("CONTACT")+"</strong> with the following error: <br />"+error.message);
		} else {
			messages.show(config.constant("ERRORS"), "Something went wrong, please contact the administrator <strong>"+config.constant("CONTACT")+"</strong> with the following error: <br />"+error);
		}
	}

	function isUnique(unique_name1, unique_name2, queryResult, row) {
	    for (i = 0; i<queryResult.length;i++) {
	      if (queryResult[i][unique_name1]==row[unique_name1] && queryResult[i][unique_name2]==row[unique_name2]) {
					return false;
	      }
	    }
	    return true;
	}

	function synchronizeSubjects(userId, callback) {
		var localsubjects = database.getQuery('getUserSubjects',[userId]);
		database.getOnlineQuery('getUserSubjects', [userId], function(remotesubjects) {
			lastId = getLatestNonSynchronizedSubjectId(localsubjects);
			if (lastId === 0) {
				callback();
			}

			synchronizeLocalSubjects(localsubjects, callback);
			synchronizeOnlineSubjects(localsubjects, remotesubjects);
			database.close();
		});
	}

	function getLatestNonSynchronizedSubjectId(localsubjects) {
		var last = 0;
		for (var i=0; i<localsubjects.length;i++) {
			if (!localsubjects[i].subject_online) {
				last = localsubjects[i].subject_id;
			}
		}
		return last;
	}

	function synchronizeLocalSubjects(localsubjects, callback) {
		for (var i=0; i< localsubjects.length; i++) {
			if (!localsubjects[i].subject_online) {
				pushSubjectOnline(localsubjects[i], callback);
			}
		}
	}

	function synchronizeOnlineSubjects(localsubjects, remotesubjects) {
		var j;
		var getRemoteFromLocal = function(e) { return e.subject_id === remotesubjects[j].subject_id; };
		for (j = 0 ;j<remotesubjects.length; j++){
			var remote = $.grep(localsubjects, getRemoteFromLocal);
			if (remote.length === 0) {
				pushSubjectLocal(remotesubjects[j]);
			}
		}
	}

	function pushSubjectOnline(subject, callback) {
		var local_id = subject.subject_id;
		subject.subject_online = 1;
		var subject = $.map(subject, function(val, key) { if (key!="subject_id") { return val; } });
		database.executeQuery('addSubjectOnline', subject, false, true);
		database.lastInsertIdOnline('tblsubjects', 'subject_id', function (id) {
			database.executeQuery('updateSubjectId', [id, local_id], true, false);
			database.executeQuery('updateDatasetSubjectId', [id, local_id], true, false);
			if (local_id==lastId) {
				callback();
			}
		});
	}

	function pushSubjectLocal(subject) {
		subject = $.map(subject, function(val) { return val; });
		database.executeQuery('addSubject', subject, true, false);
	}

	function synchronizeUser(userId, callback) {
		var local_user = database.getQuery('getUser',[userId]);
		database.getOnlineQuery("getUser", [userId], function(online_user) {

			if (local_user.length === 0) {
				saveUserOnline(online_user[0]);
			} else {
				compareUsers(local_user[0], online_user[0], callback);
			}
			callback();
		});
	}

	function compareUsers(local_user, online_user, callback) {
		var localTime = Date.parse(local_user.user_lastedited);
		var onlineTime = Date.parse(online_user.user_lastedited);
		var recent = localTime - onlineTime;
		if (recent > 0) {
			replaceUserOnline(local_user, callback);
		} else if (recent < 0) {
			replaceUserLocal(online_user);
		}
	}

	function saveUserOnline(online_user) {
		online_user = $.map(online_user, function(val, key) { return (key=="user_createdate" || key=="user_lastedited" || key=="user_bday") ? date.formatDatetime(val) : val; });
		database.executeQuery('addUser', online_user, true, false);
	}

	function replaceUserLocal(online_user) {
		online_user = $.map(online_user, function(val, key) { return (key=="user_createdate" || key=="user_lastedited" || key=="user_bday") ? date.formatDatetime(val) : val; });
		database.executeQuery('replaceUser', online_user, true, false);
	}

	function replaceUserOnline(local_user, callback) {
		local_user = $.map(local_user, function(val, key) { return (key=="user_createdate" || key=="user_lastedited" || key=="user_bday") ? date.formatDatetime(val) : val; });
		database.executeQuery('replaceUser', local_user, false, true, function() {
			callback();
		});
	}

	function synchronizeDatasets(userId, callback) {
			var localdatasets = database.getQuery('getUserDatasets',[userId]);
			database.getOnlineQuery('getUserDatasets',[userId], function(remotedatasets) {
				lastId = getLatestNonSynchronizedDatasetId(localdatasets);
				if (lastId === 0) {
					callback();
				}
				synchronizeLocalDatasets(localdatasets, remotedatasets, callback);
				synchronizeOnlineDatasets(localdatasets, remotedatasets);
				database.close();
			});
	}

	function getLatestNonSynchronizedDatasetId(localdatasets) {
		var last = 0;
		for (var i=0; i<localdatasets.length;i++) {
			if (!localdatasets[i].dataset_online) {
				last = localdatasets[i].dataset_id;
			}
		}
		return last;
	}

	function synchronizeLocalDatasets(localdatasets, remotedatasets, callback) {
		var i;
		var getLocalFromRemote = function(e) { return e.dataset_id === localdatasets[i].dataset_id; };
		for (i = 0; i< localdatasets.length; i++) {
			if (!localdatasets[i].dataset_online) {
				pushDatasetOnline(localdatasets[i], callback);
			} else {
				var remote = $.grep(remotedatasets, getLocalFromRemote);
				if (remote.length !== 0) {
					synchronizeDataset(localdatasets[i], remote[0]);
				}
			}
		}
	}

	function synchronizeOnlineDatasets(localdatasets, remotedatasets) {
		var j;
		var getRemoteFromLocal = function(e) { return e.dataset_id === remotedatasets[j].dataset_id; };
		for (j = 0; j<remotedatasets.length; j++){
			var remote = $.grep(localdatasets, getRemoteFromLocal);
			if (remote.length === 0) {
				pushDatasetLocal(remotedatasets[j]);
			}
		}
	}

	function pushDatasetOnline(dataset, callback) {
		var local_id = dataset.dataset_id;
		dataset.dataset_online = 1;
		dataset = $.map(dataset, function(val, key) { if (key!="dataset_id") { return val; } });
		database.executeQuery('addDataset', dataset, false, true);
		database.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
			database.executeQuery('updateDatasetId', [id, local_id], true, false);
			if (local_id==lastId) {
				callback();
			}
		});
	}

	function pushDatasetLocal(dataset) {
		dataset = $.map(dataset, function(val, key) { return (key=="dataset_date" || key=="dataset_lastedited") ? date.formatDatetime(val) : val; });
		database.executeQuery('addDatasetAll', dataset, true, false);
	}

	function synchronizeDataset(local, remote){
		var localTime = Date.parse(local.dataset_lastedited);
		var onlineTime = Date.parse(remote.dataset_lastedited);
		var recent = localTime - onlineTime;
		if (recent > 0) {
			replaceDatasetOnline(local, remote);
		} else if (recent < 0) {
			replaceDatasetLocal(local, remote);
		}
	}

	function replaceDatasetOnline(local, remote) {
		local = $.map(local, function(val, key) { return (key=="dataset_date" || key=="dataset_lastedited") ? date.formatDatetime(val) : val; });
		database.executeQuery('deleteDatasetbyId',[remote.dataset_id], false, true);
		database.executeQuery('addDatasetAll', local, false, true);
	}

	function replaceDatasetLocal(local, remote) {
		remote = $.map(remote, function(val, key) { return (key=="dataset_date" || key=="dataset_lastedited") ? date.formatDatetime(val) : val; });
		database.executeQuery('deleteDatasetbyId',[local.dataset_id], true, false);
		database.executeQuery('addDatasetAll', remote, true, false);
	}

	function initOnlineDBIfRequired() {
		if(db_online===undefined){
			initOnlineDB();
		}
	}

	function initOnlineDB(){
		if (database.online()) {
			db_online = mysql.createConnection({
				host     : config.constant("ONLINE_HOST"),
				user     : config.constant("ONLINE_USER"),
				password : config.constant("ONLINE_PASSWORD"),
				database : config.constant("ONLINE_DATABASE")
			});

			db_online.connect(function(err) {
				if (err) {
					messages.show("Something went wrong, please contact the administrator <strong>"+config.constant("CONTACT")+"</strong> with the following error: <br />"+ err.stack);
					return;
				}
			});
		}
	}

	var database = {
		online: function() {
			return navigator.onLine;
		},
		init: function() {
			var read_database;
			checkSqlite();
			if (database_exists(config.constant("DATABASE_USER"))) {
				read_database = fs.readFileSync(config.constant("DATABASE_USER"));
			} else {
				read_database = fs.readFileSync(config.constant("DATABASE_SLIMSTAMPEN"));
			}
			db = new sql.Database(read_database);
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
		executeQuery : function (queryname, args, local = true, remote = true, callback = false) {
			if (local) {
				database.executeQueryLocal(queryname, args);
			}
			if (remote && database.online()) {
				database.executeQueryOnline(queryname, args, callback);
			} else {
				if (callback) {
					callback();
				}
			}
		},
		executeQueryLocal(queryname, args) {
			var query = queries[queryname];
			try {
				db.run(query, args);
			} catch(e) {
				onError(e);
			}
		},
		executeQueryOnline(queryname, args, callback) {
			var query = queries[queryname];
			initOnlineDBIfRequired();
			db_online.query(query, args, function(err, result) {
				if (err) throw onError(err);
				if (callback) {
					callback();
				}
			});
		},
		getQuery: function(queryname, args) {
			var query = queries[queryname];
			var queryResult = [];
			try {
				db.each(query, args, function(row, err) {
					queryResult.push(row);
				});
			} catch (e) {
				onError(e);
			}
			return queryResult;
		},
		getOnlineQuery: function(queryname, args, callback) {
			initOnlineDBIfRequired();
			var query = queries[queryname];
			db_online.query(query, args, function(err, rows, fields) {
				if (err) throw onError(err);
				callback(rows);
			});
		},
		getUnique: function(queryname, unique_name1, unique_name2, args) {
			var queryResult = [];
			var query = queries[queryname];
			try {
				db.each(query, args, function(row) {
					if (isUnique(unique_name1, unique_name2, queryResult, row))
						queryResult.push(row);
				});
			} catch(e) {
				onError(e);
			}
			return queryResult;
		},
		lastInsertRowId: function(table_name, row_id) {
			var query = "SELECT "+row_id+" FROM "+table_name+" ORDER BY "+row_id +" DESC LIMIT 1";
			var queryResult;
			try {
				db.each(query, function(row) {
					queryResult = row[row_id];
				});
			} catch(e) {
				onError(e);
			}
			return queryResult;
		},
		lastInsertIdOnline: function(table_name, row_id, callback) {
			initOnlineDBIfRequired();
			var query = "SELECT "+row_id+" FROM "+table_name+" ORDER BY "+row_id+" DESC LIMIT 1";
			db_online.query(query, function(err, rows, fields) {
				if (err) throw onError(err);
				callback(rows[0][row_id]);
			});
		},
		each : function(queryname, args, func) {
			var query = queries[queryname];
			try {
				db.each(query,args, func);
			} catch(e) {
				onError(e);
			}
		},
		synchronize : function(userId, callback){
			initOnlineDBIfRequired();
			synchronizeSubjects(userId, function() {
				synchronizeDatasets(userId, function() {
					synchronizeUser(userId, callback);
				});
			});
		}
	};
	database.init();
	return database;
});
