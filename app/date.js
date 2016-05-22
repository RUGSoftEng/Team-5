define([], function () {
    return {
        dateToDATETIME: function(date) {
            var month = date.getMonth()+1;
            return date.getFullYear() + "-" + month + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    };
});
