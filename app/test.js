define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('./messages');
    // Load library/vendor modules using
    // full IDs, like:
    var print = require('print');

    print(messages.getHello());

    require(['jquery', 'jquery.bootstrap'], function($){
      $(function(){
          // Twitter Bootstrap 3 carousel plugin
          $(".navbar-brand").html("test");
      });
  });
});
