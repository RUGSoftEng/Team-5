/* file: databaseOnline.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 03/6/2016
 * version 1.0
 *
 * Description: Module for connection through PHP with the online database
 */

define(['app/config', 'jquery'], function (config, $) {
  function request(type, data, callback) {
    var script;
    switch (type) {
      case "connect":
        script = "connect.php";
        break;
      case "query":
        script = "query.php";
        break;
    }
    $.ajax({
        url: 'http://www.codecentral.nl/slimstampen/'+script,
        type: 'POST',
        data: function(){
            var formData = new FormData();
            for (var i = 0; i < data.length; i++) {
              formData.append(data[i][0], data[i][1]);
            }
            return formData;
        }(),
        success: function (data) {
          if (data) {
            var obj = $.parseJSON(data);
            callback(false, obj);
          } else {
            throw new Error("SOMETHING WENT WRONG WITH ONLINE DATABASE.");
          }
        },
        error: function (e) {
            callback(e, false);
        },
        cache: false,
        contentType: false,
        processData: false
    });
  }

  function escapeQuotes(string) {
    string = String(string);
    string = string.replace(/\'/g,"\\'");
    return "'"+string+"'";
  }

  var db_online = {
    connect: function(username, password, callback) {
      var data = [['username', username], ['password', password]];
      request("connect", data, callback);
    },
    query: function(query, args, callback) {
      var i = 0;
      query = query.replace(/\?/g,function(){ return escapeQuotes(args[i++]); });
      var data = [['query', query]];
      request("query", data, callback);
    }
   };
   return db_online;
});
