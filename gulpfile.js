'use strict';

// Native node stuff
var path = require( 'path' );

// Gulp and related plugins
var gulp = require( 'gulp' );
var util = require( 'gulp-util' );
var sass = require( 'gulp-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var connect = require( 'gulp-connect' );
var del = require( 'del' );
var sourcemaps = require( 'gulp-sourcemaps' );
var uglify = require( 'gulp-uglify' );

// Local Dev
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

// Config based stuff
var buildDir = 'build';
var sourceGlob = path.join( 'source', '**' );

gulp.task( 'clean', function ( cb ) {
	del( [ buildDir ], cb );
} );

gulp.task( 'css', function () {
	return gulp.src( path.join( 'sass', 'screen.scss' ) )
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( autoprefixer( 'last 2 version' ) )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( path.join( buildDir, 'css' ) ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

gulp.task( 'js', function () {
	return gulp.src( path.join( 'js', 'main.js' ) )
		.pipe( sourcemaps.init() )
		.pipe( uglify() )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( path.join( buildDir, 'js' ) ) )
		.pipe( reload( {
			stream: true
		} ) );
} );

gulp.task( 'copy', function () {
	return gulp.src( path.join( sourceGlob ) )
		.pipe( gulp.dest( buildDir ) )
		.pipe( reload( {
			stream: true
		} ) );
} );



gulp.task( 'preview', [ 'css', 'js', 'copy' ], function () {
	browserSync( {
		server: {
			baseDir: buildDir
		}
	} );

	gulp.watch( path.join( 'sass', '**', '*.scss' ), [ 'css' ] );
	gulp.watch( path.join( 'js', '**', '*.js' ), [ 'js' ] );
	gulp.watch( sourceGlob, [ 'copy' ] );
} );
