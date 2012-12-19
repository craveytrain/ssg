/*jshint quotmark:false */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    render: {
        content: ['content/**/*.yml'],
        target: 'build',
        templates: 'templates',
    },
    jade: {
        options: {
           pretty: true
        }
    },
    connect: {
        server: {
            options: {
                port: 4000,
                base: 'build',
                keepalive: true
            }
        }
    },
    clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadTasks('lib');

grunt.registerTask('build', ['clean', 'render']);
// Preview the site
grunt.registerTask('preview', ['build', 'connect:server']);

// Default task(s).
grunt.registerTask('default', ['build']);
};