// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'async', 'parsley'], function ($, db, date, select, async, parsley) {
  function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }

  var parsleyInitiated = false;

  return {
    initializeForm: function(formName) {
      var parsley;
      async.series([
        function(callback) {
          parsley = $(formName).parsley();
          callback(null, "one");
        }, function(callback) {
          parsley.on('field:validated', function() {
            // Initiate form error and success handling
            var ok = $('.parsley-error').length === 0;
            $('.bs-callout-info').toggleClass('hidden', !ok);
            $('.bs-callout-warning').toggleClass('hidden', ok);

            if (!parsleyInitiated) {
              select.parsleyErrors();
              parsleyInitiated = true;
            }
          });

          callback(null, "two");
        }
      ], function(err, results) {
        //console.log(results);
      });
      return parsley;
    }, saveDataset: function(formName) {
      var name = getFormVal(formName, "input", "name");
      var language = getFormVal(formName, "select", "language");
      var subject = getFormVal(formName, "select", "subject");
      var currentdate = new Date();

      db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
    }
  }
});
