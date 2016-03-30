define(['app/database', 'jquery'], function (db, $) {
  var item = ".selectSubject";
  var rows = db.getQuery('getUserSubjects',[]);

  for(var i = 0 ; i < rows.length; i++){
        var row = rows[i];
       $(item).append($("<option></option>")
      .attr("value",row.subject_id)
      .text(row.subject_name));
  }

  // Initiate bootstrap select box
  $(".selectpicker.selectSubject").selectpicker();

  // Activate error handling for select boxes
  window.Parsley.on('field:error', function() {
      if (this.$element.is("select")) {
          this.$element.parent().children('.selectpicker').selectpicker('setStyle', 'alert-danger').selectpicker('refresh');
      }
  });
  window.Parsley.on('field:success', function() {
      if (this.$element.is("select")) {
          this.$element.parent().children('.selectpicker').selectpicker('setStyle', 'alert-success', 'add').selectpicker('setStyle', 'alert-danger', 'remove').selectpicker('refresh');
      }
  });
  $('select').on('changed.bs.select', function (e) {
    $(this).selectpicker('setStyle', 'alert-success', 'add').selectpicker('setStyle', 'alert-danger', 'remove').selectpicker('refresh');
    $(this).parent().children(".parsley-errors-list").html("");
  });
  $('select').on('rendered.bs.select', function (e) {
    $(this).parent().removeClass("parsley-error");
  });
});
