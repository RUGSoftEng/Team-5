// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    paths: {
        "app": "../app",
        "jquery" : "jquery.min",
        "bootstrap" :  "bootstrap.min",
        "fs" : "fs",
        "sqlite" : "sql"
    }

});
