'use strict';

// Gulp and related plugins
var gulp = require( 'gulp' );
var util = require( 'gulp-util' );
var sass = require( 'gulp-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var connect = require( 'gulp-connect' );
var del = require( 'del' );
var sourcemaps = require( 'gulp-sourcemaps' );
var uglify = require( 'gulp-uglify' );
var markdown = require( 'gulp-markdown-to-json' );
var jshint = require( 'gulp-jshint' );
var stylish = require( 'jshint-stylish' );
var jscs = require( 'gulp-jscs' );

// Home grown modules
var excerpt = require( './tasks/excerpt' );
var sluggify = require( './tasks/sluggify' );
var pathify = require( './tasks/pathify' );
var jadify = require( './tasks/jadify' );
var gistify = require( './tasks/gistify' );

// Local Dev
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

// Dir based stuff
var buildDir = 'public';
var sourceGlob = 'source/**';
var mdGlob = 'content/**/*.md';

gulp.task( 'clean', function ( cb ) {
	del( [ buildDir ], cb );
} );

gulp.task( 'checkJs', function () {
	return gulp.src( [
			'**/*.js',
			'!node_modules/**/*.js',
			'!' + buildDir + '/**/*.js'
		] )
		.pipe( jshint() )
		.pipe( jshint.reporter( stylish ) )
		.pipe( jscs() );
} );

gulp.task( 'css', function () {
	return gulp.src( 'sass/screen.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( autoprefixer( 'last 2 version' ) )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( buildDir + '/css' ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

gulp.task( 'js', function () {
	return gulp.src( 'js/main.js' )
		.pipe( sourcemaps.init() )
		.pipe( uglify() )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( buildDir + '/js' ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

gulp.task( 'copy', function () {
	return gulp.src( sourceGlob )
		.pipe( gulp.dest( buildDir ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

gulp.task( 'render', function () {
	return gulp.src( mdGlob )
		.pipe( markdown() )
		// .pipe( gistify() )
		.pipe( excerpt() )
		.pipe( sluggify() )
		.pipe( pathify() )
		.pipe( jadify() )
		.pipe( gulp.dest( buildDir ) );
} );

gulp.task( 'preview', [ 'build' ], function () {
	browserSync( {
		server: {
			baseDir: buildDir
		}
	} );

	gulp.watch( 'sass/**/*.scss', [ 'css' ] );
	gulp.watch( 'js/**/*.js', [ 'js' ] );
	gulp.watch( sourceGlob, [ 'copy' ] );
	gulp.watch( mdGlob, [ 'render' ] );
} );

gulp.task( 'build', [ 'js', 'css', 'copy', 'render' ] );
