define(['intern!object', 'intern/chai!assert', 'app/time'],
  function (registerSuite, assert, time) {

    registerSuite({
        name: 'Time',

        time: function () {
            assert.strictEqual(time.secondsToMilliseconds(5), 5000,
                'time.secondsToMilliseconds should return milliseconds.');
            assert.strictEqual(time.minutesToSeconds(10), 600,
                'time.minutesToSeconds should return seconds.');
            assert.strictEqual(time.start(), "00:00",
                'time.start should have the format 00:00.');
            assert.strictEqual(time.toString(600), "10:00",
                'time.toString should have the format "mm:ss".');
        }
    });

});
