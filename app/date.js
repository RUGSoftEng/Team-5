define(["dateformat"], function (dateFormat) {
    return {
        dateToDatetime: function(date) {
            return dateFormat(date, "yyyy-mm-dd HH:mm:ss");
        },
        format: function(val, options) {
          return dateFormat(val, options, true);
        }
    };
});
