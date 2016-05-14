// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'node_modules',
    shim : {
        xlsx: {
            deps: ['jszip'],
            exports: "XLSX"
        }
    },
    paths: {
      app: "../app",
      jquery : "jquery/dist/jquery.min",
      bootstrap :  "../lib/bootstrap.min",
      sqlite : "../lib/sql",
      xlsx : "xlsx/xlsx",
      jszip : "xlsx/jszip",
      parsley : "parsleyjs/dist/parsley.min",
      "bootstrap-select": "bootstrap-select/dist/js/bootstrap-select.min",
      async : "async/dist/async",
      underscore : "underscore/underscore-min",
      utils : "../lib/slimstampen/utils",
      slimstampenModel : "../lib/slimstampen/model",
      "electron-sudo": "../lib/electronsudo.min",
      "electron-cookies": "electron-cookies/src/index",
      i18n: "../lib/i18n",
      nls: "../nls/lang",
      printf: "sprintf-js/dist/sprintf.min",
      mysql: "mysql/index"
    }
});
