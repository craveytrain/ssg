/*jshint quotmark:false */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  render: {
	stuff: 'yeah'
  },
  jade: {
	options: {
		pretty: true
	}
  },
  server: {
	port: 4000,
	base: './build'
  },
  clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadTasks('lib');

grunt.registerTask('build', ['clean', 'render']);

// Default task(s).
grunt.registerTask('default', ['build']);
};