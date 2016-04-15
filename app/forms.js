// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'async', 'parsley'], function ($, db, date, select, async, parsley) {
  function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }

  var parsleyInitiated = false;

  return {
    initializeForm: function(formName, onSuccess) {
      var parsley;
      async.series([
        function(callback) {
          async.during(
            function (callback2) {
              return callback2(null, $(formName).length==0);
            },
            function (callback2) {
              alert("try again");
              window.location = window.location.href;
            },
            function (err) {
              parsley = $(formName).parsley();
              callback(null, "Initiate parsley");
            }
          );
        }, function(callback) {
          console.log(parsley);
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
          callback(null, "Add methods to form");
        }
      ], function(err,results) {
        console.log(results);
      });
    }, saveDataset: function(formName) {
      var name = getFormVal(formName, "input", "name");
      var language = getFormVal(formName, "select", "language");
      var subject = getFormVal(formName, "select", "subject");
      var currentdate = new Date();

      db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
    }
  }
});
