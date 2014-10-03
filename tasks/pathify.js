'use strict';

var path = require( 'path' );
var util = require( 'gulp-util' );
var through = require( 'through2' );

var PLUGIN_NAME = 'gulp-pathify';

function getPath( file ) {
	// passed in from md file
	var content = JSON.parse( file.contents.toString() );
	var relativePath = file.relative;
	var basename = path.basename( relativePath, path.extname( relativePath ) );
	// create array for path for easier manipulation
	var taxonomy = path.dirname( relativePath ).split( '/' );

	// if the first dir is '.', get rid of it
	if ( taxonomy[ 0 ] === '.' ) taxonomy.shift();

	// if the basename isn't 'index', add the basename as a directory
	if ( basename !== 'index' ) taxonomy.push( basename );

	// add leading and trailing (and intermediate) slashes
	// normalize to clean up dupe slashes
	content.pathname = path.normalize( '/' + taxonomy.join( '/' ) + '/' );

	// Have to stringify back for the buffer
	return JSON.stringify( content );
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
			file.contents = new Buffer( getPath( file ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
