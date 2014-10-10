'use strict';

var util = require( 'gulp-util' );
var through = require( 'through2' );
var http = require( 'http' );

var PLUGIN_NAME = 'gulp-gistify';

// check for gist tags grabbin id and filename
var reGist = new RegExp( /\{%\s+gist\s+(\d+)\s+([\w\-]+\.\w+)\s+%\}/ig );

// return a script tag to embed the gist asset and a noscript to link to the asset on the gist
function buildGistURL( orig, gistId, filename ) {
	return '<script src="https://gist.github.com/craveytrain/' + gistId + '.js?file=' + filename + '"></script><noscript><a href="https://gist.github.com/craveytrain/' + gistId + '#file-' + filename.replace( '.', '-' ) + '">' + filename + '</a></noscript>';
}

function gistify( model ) {
	var data = JSON.parse( model );

	// replace gist tag with a gist embed script and a noscript link to the asset
	data.body = data.body.replace( reGist, buildGistURL );

	return JSON.stringify( data );
}

module.exports = function ( options ) {
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
			file.contents = new Buffer( gistify( file.contents.toString() ) );
			this.push( file );
		} catch ( err ) {
			this.emit( 'error', new util.PluginError( PLUGIN_NAME, err ) );
		}

		cb();
	} );
};
