'use strict';

var path = require( 'path' );
var fs = require( 'fs' );
var glob = require( 'glob' );
var jade = require( 'jade' );

module.exports = function ( templateDir ) {
	// Grab all the templates in the root directory
	var obj = {};

	glob.sync( templateDir + '/*.jade' ).forEach( function ( template ) {

		// Get just the name for keys
		var templateName = path.basename( template, '.jade' );

		// we don't want layout as an option for a template
		if ( templateName === 'layout' ) return;

		// return a function for each template type
		obj[ templateName ] = jade.compileFile( template, {
			filename: templateName
		} );
	} );

	return obj;
};
