'use strict';

var util = require( 'gulp-util' );
var through = require( 'through2' );

var PLUGIN_NAME = 'gulp-excerpt';

function getExcerpt( text, maxLength ) {
	// Trim HTML out
	text = text.replace( /(<([^>]+)>)/ig, '' );

	// Stop excerpt if one of these characters is encountered
	var reBreakChar = /[`#]/;
	var breakCharIndex = text.search( reBreakChar );

	// If breakChar is encountered, set the cut index to that, otherwise the max length
	var cutIndex = breakCharIndex > -1 ? Math.min( breakCharIndex, maxLength ) : maxLength;

	// While the last character isn't a space, keep trimming to not cut a word in half
	while ( !/\s/.test( text[ cutIndex ] ) && cutIndex ) {
		cutIndex--;
	}

	// return the truncated text adding ellipsis to the end
	return text.substring( 0, cutIndex ).trim() + '…';
}

function excerpt( model, options ) {
	var data = JSON.parse( model );

	// set the excerpt to that member of the model
	data.excerpt = getExcerpt( data[ options.field ], options.trimLength );

	// Have to stringify back for the buffer
	return JSON.stringify( data );
}

module.exports = function ( options ) {
	// If options aren't passed in, set them
	if ( !options ) options = {};

	// Take specified trimLength or set it to 200
	options.trimLength = options.trimLength || 200;

	// Take specified field or set it to 'content'
	options.field = options.field || 'body';


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
			file.contents = new Buffer( excerpt( file.contents.toString(), options ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
