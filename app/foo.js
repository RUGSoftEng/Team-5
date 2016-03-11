{
    appDir: "../",
    baseUrl: "lib",
    paths: {
        requireLib: '../lib/require'
    },
    //dir: "../../appdirectory-build",

    //Put in a mapping so that 'requireLib' in the
    //modules section below will refer to the require.js
    //contents.


    //Indicates the namespace to use for require/requirejs/define.
    namespace: "foo",
    modules: [
        {
            name: "foo",
            include: ["requireLib", "app"],
            //True tells the optimizer it is OK to create
            //a new file foo.js. Normally the optimizer
            //wants foo.js to exist in the source directory.
            create: true
        }
    ]
}
