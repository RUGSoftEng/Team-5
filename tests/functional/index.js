define(['intern!object', 'intern/chai!assert'],
  function (registerSuite, assert) {

    registerSuite({
        name: 'index',

        loginForm: function () {
          return this.remote
              .get(require.toUrl('index.html'))
              .setFindTimeout(5000)
              .findById('nameField')
                  .click()
                  .type('Elaine')
                  .end()
              .findByCssSelector('#loginForm input[type=submit]')
                  .click()
                  .end()
              .findById('name')
              .getVisibleText()
              .then(function (text) {
                  assert.strictEqual(text, 'Elaine',
                      'The name of the user should be displayed when the form is submitted');
              });
        }
    });
});
