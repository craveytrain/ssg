'use strict';

var path = require( 'path' );
var util = require( 'gulp-util' );
var through = require( 'through2' );
var extend = require( 'extend' );
var siteModel = require( './getModel' )();

var PLUGIN_NAME = 'gulp-jadify';

function renderTemplates( file, templates, options ) {
	// passed in from md file
	var local = JSON.parse( file.contents.toString() );
	// get the site yaml file
	// consolidate
	var model = extend( {}, siteModel, local );

	// get pageType or assume post
	// run the template against the consolidated model
	var markup = templates[ model.pageType || 'post' ]( model );

	// Build out base with build directory
	file.base = path.normalize( file.cwd + '/' + options.buildDir );

	// Build out path with:
	// - base set above
	// - pathname from the model
	// - index.html
	file.path = path.normalize( file.base + model.pathname + '/index.html' );

	// Send the markup back
	return markup;
}

module.exports = function ( options ) {
	// If options aren't passed in, set them
	if ( !options ) options = {};

	// Take specified trimLength or set it to 200
	options.templates = options.templates || 'templates';

	// Take specified trimLength or set it to 200
	options.buildDir = options.buildDir || 'build';

	return through.obj( function ( file, enc, cb ) {
		if ( file.isNull() ) {
			this.push( file );
			cb();
			return;
		}

		if ( file.isStream() ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, 'Streaming not supported' ) );
			cb();
			return;
		}

		try {
			// Send file and templates functions
			file.contents = new Buffer( renderTemplates( file, require( './getTemplates' )( options.templates ), options ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
