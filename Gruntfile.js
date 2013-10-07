module.exports = function(grunt) {
'use strict';

// Project configuration.
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	copy: {
		dist: {
			files: [
				{
					cwd: 'source/',
					expand: true,
					src: ['**', '!stylesheets/**'],
					dest: 'build/'
				}
			]
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

	stylus: {
		compile: {
			options: {
				linenos: true
			},
			files: {
				'build/css/default.css': 'source/stylesheets/default.styl'
			}
		}
	},

	uglify: {
		dist: {
			options: {
				report: 'gzip',
				sourceMapRoot: '/',
				sourceMap: 'build/js/source-map.js',
				sourceMapPrefix: 1,
				sourceMappingURL: '/js/source-map.js'
			},
			files: [
				{
					expand: true,		// Enable dynamic expansion.
					cwd: 'build/js/',	// Src matches are relative to this path.
					src: ['**/*.js'],	// Actual pattern(s) to match.
					dest: 'build/js/',	// Destination path prefix.
					ext: '.min.js'		// Dest filepaths will have this extension.
				}
			]
		}
	},

	watch: {
		css: {
			files: 'source/stylesheets/**/*.styl',
			tasks: ['stylus'],
			options: {
				interrupt: true
			}
		},

		js: {
			files: 'source/js/**/*.js',
			tasks: ['uglify'],
			options: {
				interrupt: true
			}
		},

		templates: {
			files: ['**/*.yml', 'templates/**/*.jade', 'content/**/*.md'],
			tasks: ['render'],
			options: {
				interrupt: true
			}
		},

		staticFiles: {
			files: ['source/**', '!source/stylesheets/**'],
			tasks: ['copy'],
			options: {
				interrupt: true
			}
		}
	},

	jshint: {
		options: {
			jshintrc: '.jshintrc'
		},
		grunt: ['Gruntfile.js', 'lib/**/*.js', 'tasks/**/*.js'],
		site: ['source/**/*.js']

	},

	htmlmin: {
		dist: {
			options: {
				removeComments: true,
				removeCommentsFromCDATA: true,
				removeCDATASectionsFromCDATA: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeRedundantAttributes: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true
			},
			files: {
				'build/**/*.html': 'build/**/*.html'
			}
		}
	},

	connect: {
		server: {
			options: {
				port: 4000,
				base: 'build'
			}
		}
	},

	clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-stylus');
grunt.loadTasks('tasks');

grunt.registerTask('build', ['clean', 'jshint', 'copy', 'render', 'stylus', 'uglify']);
grunt.registerTask('preview', ['build', 'connect', 'watch']);
// grunt.registerTask('package', ['clean', 'jshint', 'copy', 'render', 'stylus', 'uglify']);

// Default task(s).
grunt.registerTask('default', ['build']);
};
