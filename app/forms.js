// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'parsley', 'app/user'], function ($, db, date, select, parsley, user) {
  var parsleyInitiated = false;

  function saveDatasetItems(formItems, id) {
    for (i = 0; i<formItems; i++) {
      var question = getItemVal("question", i);
      var answer = getItemVal("answer", i);
      var hint = getItemVal("hint", i);
      hint = (hint==="undefined") ? "" : hint;
      db.executeQuery('addDatasetItem' , [id, question, answer, hint]);
    }
  }

  function saveDatasetOnlineAndLocal(formItems, data) {
    db.executeQuery("addDataset", data, false, true);
    db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
      data.unshift(id);
      db.executeQuery("addDatasetLocal", data, true, false);
      saveDatasetItems(formItems, id);
      db.close();
      callback();
    });
  }

  var forms = {
    getItemVal: function(formName, formIndex) {
      return $("#items input[name='" + formName + formIndex + "']").val();
    },
    getFormVal: function(parentName, formType, formName) {
      return $(parentName).find(formType + '[name="' + formName + '"]').val();
    },
    initialize: function(formName, onSuccess) {
      var parsley = $(formName).parsley();
      parsley.on('field:validated', function() {
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
      });
    },
    onSuccess: function (formName, callback) {
      var parsley = $(formName).parsley();
      parsley.on('form:success', callback);
    },
    saveDataset: function(formName, formItemId, callback) {
      var name = getFormVal(formName, "input", "name");
      var language = getFormVal(formName, "select", "language");
      var subject = $("#datasetsubject").data("subject");
      var user_id = user.getCookie('user_id');
      var currentdate = new Date();
			
			// Create custom subject if appropriate
			if (subject == 0) {
				subject = db.lastInsertRowId("tblsubjects", "subject_id") + 1;
				var newsubjectname = $("#customsubject").val();
				db.executeQuery('addSubject' , [subject, newsubjectname]);
			}
			
      if (db.online()) {
        saveDatasetOnlineAndLocal(formItemId, [user_id, name, language, subject, 0, 0, 1, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
      } else {
        db.executeQuery("addDataset", [user_id, name, language, subject, 0, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)], true, false);
      }
    }
  };
  return forms;
});
