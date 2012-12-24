/*jshint quotmark:false */
module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        dist: {
            files: {
                'build/': ['source/**', '!source/stylesheets/**']
            }
        }
    },
    render: {
        content: ['content/**/*.md'],
        target: 'build',
        templates: 'templates',
    },
    jade: {
        options: {
           pretty: true
        }
    },
    compass: {
        dev: {
            options: {
                outputStyle: 'expanded',
                debugInfo: true
            }
        },
        dist: {
                options: {
                    outputStyle: 'compressed'
                }
            },
        options: {
            sassDir: 'source/stylesheets',
            cssDir: 'build/stylesheets',
            imagesDir: 'source/images'
        }

    },
    uglify: {
        dist: {
            options: {
                sourceMap: 'build/scripts/main.min.js.map',
                sourceMappingURL: 'main.min.js.map',
                prefix: '2'
            },
            files: {
                'build/scripts/main.min.js': 'build/scripts/main.js'
            }
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
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadTasks('lib');

grunt.registerTask('build', ['clean', 'copy', 'render', 'compass:dev', 'uglify']);
// Preview the site
grunt.registerTask('preview', ['build', 'connect']);

// Default task(s).
grunt.registerTask('default', ['build']);
};