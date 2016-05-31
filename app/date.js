define(["dateformat"], function (dateFormat) {
    return {
        formatDatetime: function(date, localise=false) {
            return dateFormat(date, "yyyy-mm-dd HH:mm:ss", localise);
        },
        format: function(val, options) {
          return dateFormat(val, options, true);
        }
    };
});
