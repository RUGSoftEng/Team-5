// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'parsley'], function ($, db, date, select, parsley) {
  function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }

  var parsleyInitiated = false;

  return {
    initializeForm: function(formName, onSuccess) {
      var parsley = $(formName).parsley();
      window.Parsley.on('field:validated', function() {
        // Initiate form error and success handling
        var ok = $('.parsley-error').length === 0;
        $('.bs-callout-info').toggleClass('hidden', !ok);
        $('.bs-callout-warning').toggleClass('hidden', ok);

        if (!parsleyInitiated) {
          select.parsleyErrors();
          parsleyInitiated = true;
        }
      }).on('form:submit', function() {
        return false;
      }).on('form:success', onSuccess);
    }, saveDataset: function(formName) {
      var name = getFormVal(formName, "input", "name");
      var language = getFormVal(formName, "select", "language");
      var subject = getFormVal(formName, "select", "subject");
      var currentdate = new Date();

      db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
    }
  };
});
