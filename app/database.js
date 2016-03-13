define(['sqlite', 'fs'], function (sqlite, fs) {
	var SQL;

	window.onload = function(){
	    init();
	}
	function init() {
		// Initiate database
		if (typeof sqlite !== 'object') {
			document.body.style.backgroundColor = 'red';
			alert("Failed to require sql.js through AMD");
		} else {
			SQL = sqlite;
		}
		var filebuffer = fs.readFileSync('./app/db.sqlite');
		// Load the db
		var db = new SQL.Database();
	}
	
	function createTable(table){

	}

	// Function for Handeling query Error
	function onError(tx, error) {
	   console.log("this error "+error.message);
	}

	var database = {
		insertRecord:	function (table, link_, title){
				createTable("datasets");
		    db.transaction(function (tx) {
					tx.executeSql("INSERT OR IGNORE INTO "+table+ " (link,title) VALUES (?, ?)", [link_,title], onError);
				}, function(tx, error){
					alert(error);
				});
		},
		getRecord: function (table,title){
			db.transaction(function (tx) {
				tx.executeSql("SELECT * FROM " + table , [], function (tx, results) {
					var len = results.rows.length;
					if(len>0){
						//alert(len);
						var dataset = results.rows.item(0);
						url =  dataset['link'];
						getjson(url);
						$("#currentDataset").val(url);
					}
			   }, null);
			});
		}
	}
	return database;
});
