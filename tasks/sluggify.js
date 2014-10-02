'use strict';

var path = require( 'path' );
var util = require( 'gulp-util' );
var through = require( 'through2' );

var PLUGIN_NAME = 'gulp-sluggify';

function slugme( file ) {
	var model = JSON.parse( file.contents.toString() );

	// Get basename stripping extesion
	model.slug = path.basename( file.path, path.extname( file.path ) );

	// Have to stringify back for the buffer
	return JSON.stringify( model );
}

module.exports = function () {
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
			file.contents = new Buffer( slugme( file ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
