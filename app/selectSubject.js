define(['app/database', 'jquery'], function (db, $) {
  var item = ".selectSubject"
  db.each("getSubjects", "", function (row,err) {
    $(item).append($("<option></option>")
      .attr("value",row.subject_id)
      .text(row.subject_name));
  });
});
