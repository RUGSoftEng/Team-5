// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select'], function ($, db, date, select) {
  function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }
  parsleyInitiated = false;

  return {
    initializeForm: function(formName) {
      return $(formName).parsley().on('field:validated', function() {
        // Initiate form error and success handling
        var ok = $('.parsley-error').length === 0;
        $('.bs-callout-info').toggleClass('hidden', !ok);
        $('.bs-callout-warning').toggleClass('hidden', ok);

        if (!parsleyInitiated) {
          select.parsleyErrors();
          parsleyInitiated = true;
        }
      });
    },

    saveIntoDatabase: function(formName) {
			var name = getFormVal(formName, "input", "name");
			var language = getFormVal(formName, "select", "language");
			var subject = getFormVal(formName, "select", "subject");
			var currentdate = new Date();

			db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
    }
  }
});
