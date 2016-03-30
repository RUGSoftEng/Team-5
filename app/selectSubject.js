define(['app/database', 'jquery'], function (db, $) {
  var item = ".selectSubject";
  var rows = db.getQuery('getUserSubjects',[]);

  for(var i = 0 ; i < rows.length; i++){
        var row = rows[i];
       $(item).append($("<option></option>")
      .attr("value",row.subject_id)
      .text(row.subject_name));
  }
});
