define(['intern!object', 'intern/chai!assert'],
  function (registerSuite, assert) {

    registerSuite({
        name: 'index',

        loginForm: function () {
          return this.remote
              .get(require.toUrl('login.html'))
              .setFindTimeout(5000)
              .findByCssSelector('#loginForm input[type=submit]')
                  .click()
                  .end()
        }
    });
});
