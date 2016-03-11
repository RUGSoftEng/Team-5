define(function (require) {
var db = openDatabase("SlimStampen2", "1.0", "SlimStampen database", 200000);  // Open SQLite Database

function createTable(table){

	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS "+ table +" (link TEXT PRIMARY KEY UNIQUE, title TEXT)");
	}, function(tx, error){
		alert(error);
	});
}

// Function for Handeling query Error
function onError(tx, error) {
   console.log("this error "+error.message);
}
window.onload = function(){
    init();
}

return{
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
	},
	 init: function()  {

	    try {
			// Check browser is supported SQLite or not.
	        if (!window.openDatabase) {
	            alert('Databases are not supported in this browser.');
	        } else {
				// If supported then call Function for create table in SQLite
	            createTable("datasets");
	        }
	    }catch (e) {
	        if (e == 2) {
	            console.log("Invalid database version.");
	        } else {
	            console.log("Unknown error " + e + ".");
	        }
	        return;
	    }

	}
}

});
