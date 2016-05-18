// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'parsley', 'app/user'], function ($, db, date, select, parsley, user) {
  function getItemVal(formName, formIndex) {
    return $("#items input[name='" + formName + formIndex + "']").val();
  }
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
    }, saveDataset: function(formName, formItemId, callback) {
      var name = getFormVal(formName, "input", "name");
      var language = getFormVal(formName, "select", "language");
      var subject = getFormVal(formName, "select", "subject");
      var user_id = user.getCookie('user_id');
      var currentdate = new Date();

      if (db.online()) {
        db.executeQuery("addDataset", [user_id, name, language, subject, 0, 0, 1, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)], false, true);
        db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
          db.executeQuery("addDatasetLocal", [id, user_id, name, language, subject, 0, 0, 1, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)], true, false);

          for (i = 0; i<formItemId; i++) {
            var question = getItemVal("question", i);
            var answer = getItemVal("answer", i);
            var hint = getItemVal("hint", i);
            hint = (hint==="undefined") ? "" : hint;
            db.executeQuery('addDatasetItem' , [id, question, answer, hint]);
          }
          db.close();
          callback();
        });
      } else {
        db.executeQuery("addDataset", [user_id, name, language, subject, 0, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)], true, false);
      }
    }
  };
});
