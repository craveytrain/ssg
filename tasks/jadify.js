'use strict';

var path = require( 'path' );
var util = require( 'gulp-util' );
var through = require( 'through2' );
var extend = require( 'extend' );

var PLUGIN_NAME = 'gulp-jadify';

function renderTemplates( file, templates ) {
	// passed in from md file
	var local = JSON.parse( file.contents.toString() );
	// get the site yaml file
	var site = require( './getModel' )();
	// consolidate
	var model = extend( {}, site, local );

	// get pageType or assume post
	// run the template against the consolidated model
	var markup = templates[ model.pageType || 'post' ]( model );

	console.log( markup );

	// Have to stringify back for the buffer
	return JSON.stringify( markup );
}

module.exports = function ( options ) {
	// If options aren't passed in, set them
	if ( !options ) options = {};

	// Take specified trimLength or set it to 200
	options.templates = options.templates || 'templates';

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
			file.contents = new Buffer( renderTemplates( file, require( './getTemplates' )( options.templates ) ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
