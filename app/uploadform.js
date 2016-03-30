define(['jquery','app/messages', 'app/config', 'parsley', 'bootstrap-select', 'app/upload'], function ($,messages,config, parsley, select, upload) {
  console.log(upload);
  $(function () {
    $(".selectpicker").selectpicker();
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

    // Initiate form error handling
    $('#uploadForm').parsley().on('field:validated', function() {
      var ok = $('.parsley-error').length === 0;
      $('.bs-callout-info').toggleClass('hidden', !ok);
      $('.bs-callout-warning').toggleClass('hidden', ok);
      if (ok) {
        upload.saveToDatabase();
      }
    })
    .on('form:submit', function() {
      return false; // Don't submit form
    });
  });

  var correctUpload = false;

  window.Parsley.addValidator('fileXlsx', {
    validateString: function(_value, maxSize, parsleyInstance) {
      return correctUpload;
    },
    requirementType: 'integer',
    messages: {
      en: 'This file is not supported.'
    }
  });

});
