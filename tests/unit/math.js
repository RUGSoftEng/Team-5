define(['intern!object', 'intern/chai!assert', 'app/math'],
  function (registerSuite, assert, math) {

    registerSuite({
        name: 'Percentage',

        percentage: function () {
            assert.strictEqual(math.percentage(1,2), 50,
                'math.percentage should return a correct percentage.');
            assert.strictEqual(math.percentage(1,100), 1,
                'math.percentage should return a correct percentage.');
        }
    });

});
