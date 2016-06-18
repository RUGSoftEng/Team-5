define(['app/lang', 'app/database', 'jquery', 'bootstrap-select', 'app/user'], function (lang, db, $, bootstrapSelect, user) {
  function loadLanguages(item){
    db.each("getLanguages", "", function (row,err) {
      $(item).append($("<option></option>")
        .attr("value",row.language_id)
        .text(row.language_name));
    });
  }

  function loadGUILanguages(item, selected){
    db.each("getGUILanguages", "", function (row,err) {
      $(item).append($((selected == row.language_short) ? "<option selected></option>" : "<option></option>")
        .attr("value",row.language_short)
        .text(row.language_name));
    });
  }

  function loadSubjects(item){
    var rows = db.getQuery('getUserSubjects',[user.get("user_id")]);
    // Add an option for adding custom subject
		$(item).append($("<option></option>")
      .attr("value", 0)
      .text(lang("placeholder_customsubject")));
    $(item).append($('<option data-divider="true"></option>'));
    addSubjects(item, rows);
  }

  function addSubjects(item, rows) {
    for (var i = 0 ; i < rows.length; i++) {
      var row = rows[i];
      $(item).append($("<option></option>")
        .attr("value",row.subject_id)
        .text(row.subject_name));
    }
  }

  return {
    initiate: function(name, item, selected = false) {
      switch (name) {
        case 'languages':
          loadLanguages(item);
          break;
				case 'gui_languages':
					loadGUILanguages(item, selected);
					break;
        case 'subjects':
          loadSubjects(item);
          break;
        default:
          console.log('failed to load'+name);
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
