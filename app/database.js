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
	if (database_exists("./database/user.sqlite")) {
		read_database = fs.readFileSync("./database/user.sqlite");
	} else {
		read_database = fs.readFileSync("./database/slimstampen.sqlite");
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
		close:function () {
			var data = db.export();
			var buffer = new Buffer(data);
			fs.writeFileSync("./database/user.sqlite", buffer);
			console.log("Closed connection");
		}
	}
	return database;
});
