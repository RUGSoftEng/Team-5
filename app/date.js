define(["dateformat"], function (dateFormat) {
    return {
        dateToDATETIME: function(date) {
            return date.getFullYear() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },
        format: function(val, options) {
          return dateFormat(val, options, true);
        }
    };
});
