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
        "jquery" : "../lib/jquery.min",
        "bootstrap" :  "../lib/bootstrap.min",
        "cpexcel" : "../lib/xlsx/dist/cpexcel",
        "xlsx" : "../lib/xlsx/xlsx",
        "shim" : "../lib/xlsx/shim",
        "jszip" : "../lib/xlsx/jszip",
        "ods": "../lib/xlsx/dist/ods",
        "exceltojson": "../exceltojson",
        "fs" : "../lib/fs"
    }

});




// Start loading the main app file. Put all of
// your application logic in there.
//requirejs(['app/learning']);
