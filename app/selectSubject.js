define(['app/database', 'jquery', 'parsley', 'bootstrap-select'], function (db, $, parsley, select) {
  // Get subjects from database
  db.each("getSubjects", "", function (row,err) {
    $(".selectSubject").append($("<option></option>")
      .attr("value",row.subject_id)
      .text(row.subject_name));
  });

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
