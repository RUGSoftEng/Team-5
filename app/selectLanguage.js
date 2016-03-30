define(['app/database', 'jquery'], function (db, $) {
  var item = ".selectLanguage"
  var rows = db.getQuery('getLanguages',[]);
    for(var i = 0 ; i < rows.length; i++){
        var row = rows[i];
        $(item).append($("<option></option>")
        .attr("value",row.language_id)
        .text(row.language_name));
    }
});
