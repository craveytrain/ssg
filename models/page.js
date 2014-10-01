'use strict';

var marked = require( 'supermarked' );
var extend = require( 'extend' );

marked.aliases = {
	html: 'xml'
};

module.exports = {
	buildModel: function ( baseModel, data, taxonomy ) {
		// trim the whitespace from the content, drop it back in the model
		var content = data.__content.trim();

		var body = marked( content );

		return extend( {}, baseModel, data, {
			content: content,
			body: body,
			pageSlug: data.pageTaxonomy[ data.pageTaxonomy.length - 1 ]
		} );
	}
};
