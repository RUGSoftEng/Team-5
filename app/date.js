define(["dateformat"], function (dateFormat) {
    return {
        formatDatetime: function(date, localise=false) {
            return dateFormat(date, "yyyy-mm-dd HH:mm:ss", localise);
        },
        formatBirthdate: function(date, localise=false) {
            return dateFormat(date, "yyyy-mm-dd", localise);
        },
        format: function(val, options) {
          return dateFormat(val, options, true);
        }
    };
});
