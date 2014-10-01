'use strict';

module.exports = function ( text ) {
	if ( typeof text !== 'string' ) return false;

	// Max excerpt length
	var maxLength = 200;
	// Stop excerpt if one of these characters is encountered
	var reBreakChar = /[`#]/;
	var breakCharIndex = text.search( reBreakChar );
	// If breakChar is encountered, set the cut index to that, otherwise the max length
	var cutIndex = breakCharIndex > -1 ? Math.min( breakCharIndex, maxLength ) : maxLength;

	// While the last character isn't a space, keep trimming to not cut a word in half
	while ( !/\s/.test( text[ cutIndex ] ) && cutIndex ) {
		cutIndex--;
	}

	return text.substring( 0, cutIndex ).trim() + '…';
};
