define([], function () {
    return {
        dateToDATETIME: function(date) {
            return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        }
    };
});
