define(['app/database', 'jquery', 'parsley', 'bootstrap-select'], function (db, $, parsley, select) {
  // Load languages from database
  var item = ".selectLanguage"
  db.each("getLanguages", "", function (row,err) {
    $(item).append($("<option></option>")
      .attr("value",row.language_id)
      .text(row.language_name));
  });

  $(function() {
    // Initiate bootstrap select box
    $(".selectpicker.selectLanguage").selectpicker();
    
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
});
