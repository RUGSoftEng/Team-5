define(['app/database', 'jquery'], function (db, $) {
  var item = ".selectLanguage"
  db.each("getLanguages", "", function (row,err) {
    $(item).append($("<option></option>")
      .attr("value",row.language_id)
      .text(row.language_name));
  });
});
