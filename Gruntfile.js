module.exports = function ( grunt ) {
	'use strict';

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		copy: {
			dist: {
				files: [ {
					cwd: 'source/',
					expand: true,
					src: [ '**' ],
					dest: 'build/'
				} ]
			}
		},

		render: {
			content: [ 'content/**/*.md' ],
			target: 'build',
			templates: 'templates'
		},

		jade: {
			options: {
				pretty: true
			}
		},

		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'build/css/screen.css': 'sass/screen.scss'
				}
			}
		},

		autoprefixer: {
			options: {},
			css: {
				expand: true,
				src: 'build/css/*.css',
				dest: ''
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
				files: [ {
					expand: true, // Enable dynamic expansion.
					cwd: 'build/js/', // Src matches are relative to this path.
					src: [ '**/*.js' ], // Actual pattern(s) to match.
					dest: 'build/js/', // Destination path prefix.
					ext: '.min.js' // Dest filepaths will have this extension.
				} ]
			}
		},

		watch: {
			css: {
				files: 'sass/**/*.scss',
				tasks: [ 'sass', 'autoprefixer' ],
				options: {
					interrupt: true
				}
			},

			js: {
				files: 'source/js/**/*.js',
				tasks: [ 'jshint:client', 'copy', 'uglify' ],
				options: {
					interrupt: true
				}
			},

			templates: {
				files: [ '**/*.yml', 'templates/**/*.jade', 'content/**/*.md' ],
				tasks: [ 'render' ],
				options: {
					interrupt: true
				}
			},

			staticFiles: {
				files: [ 'source/**', '!source/js/**/*.js' ],
				tasks: [ 'copy' ],
				options: {
					interrupt: true
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			grunt: [ 'Gruntfile.js', 'lib/**/*.js', 'tasks/**/*.js' ],
			site: [ 'models/**/*.js' ],
			client: [ 'source/**/*.js' ]

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

		clean: [ 'build' ]
	} );

	// Auto load all grunt tasks
	require( 'load-grunt-tasks' )( grunt );
	grunt.loadTasks( 'tasks' );

	grunt.registerTask( 'build', [ 'clean', 'jshint', 'copy', 'render', 'sass', 'autoprefixer', 'uglify' ] );
	grunt.registerTask( 'preview', [ 'build', 'connect', 'watch' ] );

	// Default task(s).
	grunt.registerTask( 'default', [ 'build' ] );
};
