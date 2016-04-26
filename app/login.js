/* file: login.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 26/4/2016
 * version 1.0
 *
 * Description:
 * Main script for initiating the welcome  page.
 */

define([], function () {
	var options = {		
	  name: 'SlimStampen',
//	  icns: '/path/to/icns/file', // (optional, only for MacOS), 
	  process: {
	    options: {
	      // Can use custom environment variables for your privileged subprocess 
	      env: {'VAR': 'VALUE'}

	      // ... and all other subprocess options described here 
	      // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback 
		},
	    on: function(ps) {
	      ps.stdout.on('data', function(data) {
	      });
	      setTimeout(function() {
	        ps.kill()
	      }.bind(ps), 50000);
	    }
	  }
	};
	electronsudo.exec("chmod 0777 database/user.sqlite", options, function(error) {});
});
