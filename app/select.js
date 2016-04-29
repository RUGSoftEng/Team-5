define(['app/database', 'jquery', 'bootstrap-select'], function (db, $, parsley, bootstrapSelect) {
  return {
    initiate: function(name, item) {
      switch (name) {
        case 'languages':
          // Load languages from database
          db.each("getLanguages", "", function (row,err) {
            $(item).append($("<option></option>")
              .attr("value",row.language_id)
              .text(row.language_name));
          });
          break;
        case 'subjects':
          // Load subjects from database
          var rows = db.getQuery('getUserSubjects',[]);
          // Add an option for each subject to the dropdown
          for (var i = 0 ; i < rows.length; i++) {
            var row = rows[i];
            $(item).append($("<option></option>")
              .attr("value",row.subject_id)
              .text(row.subject_name));
          }
          break;

      }
      // Initiate bootstrap select box
      $(".selectpicker"+item).selectpicker();
    },
    parsleyErrors: function() {
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
    }
  };
});
