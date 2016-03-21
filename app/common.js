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
        jszip : "xlsx/jszip"
    }

});
