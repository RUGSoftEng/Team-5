define(['intern!object', 'intern/chai!assert', 'app/math'],
  function (registerSuite, assert, math) {

    registerSuite({
        name: 'math',

        moveTwo: function () {
            assert.strictEqual(math.moveTwo(3), 5,
                'math.moveTwo should move the first argument two away from zero.');
            assert.strictEqual(math.moveTwo(-3), -5,
                'math.moveTwo should move the first argument two away from zero.');
        }
    });

});
