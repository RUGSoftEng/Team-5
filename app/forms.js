// General functions for forms

define(['jquery', 'app/database', 'app/date', 'app/select', 'async', 'parsley'], function ($, db, date, select, async, parsley) {
  function getFormVal(parentName, formType, formName) {
    return $(parentName).find(formType + '[name="' + formName + '"]').val();
  }

  // Auxiliary form functions
  function getItemVal(formName, formIndex) {
    return $("#items input[name='" + formName + formIndex + "']").val();
  }

  function saveIntoDatabase(formName) {
    var name = getFormVal(formName, "input", "name");
    var language = getFormVal(formName, "select", "language");
    var subject = getFormVal(formName, "select", "subject");
    var currentdate = new Date();

    db.executeQuery("addDataset", [0, name, language, subject, 0, 0, date.dateToDATETIME(currentdate), date.dateToDATETIME(currentdate)]);
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
          }).on('form:success', function() {
      			saveIntoDatabase(formName);
      			// Save all items in the dataset
      	    var id = db.lastInsertRowId("tbldatasets", "dataset_id");
      			for (i = 0; i<=formItemId; i++) {
      				var question = getItemVal("question", i);
      				var answer = getItemVal("answer", i);
      				var hint = getItemVal("hint", i);
      				hint = (hint==="undefined") ? "" : hint;

      				db.executeQuery('addDatasetItem' , [id, question, answer, hint]);
      			}
      			db.close();
      			window.location = 'index.html';
      		});
          // Check in the database if the name of the dataset already exists
        	window.Parsley.addValidator('datasetName', {
        		validateString: function(value, requirement) {
        			var result = db.getQuery("getDatasetByName", [value]);
        			return result.length == 0;
        		},
        		messages: {
        			en: 'This name is already used for another dataset.'
        		}
        	});
          callback(null, "two");
        }
      ], function(err, results) {
        //console.log(results);
      });
    }
  }
});
