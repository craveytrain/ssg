'use strict';

var extend = require( 'extend' );

var pageModel = require( './page' );
var postModel = require( './post' );

module.exports = {
	buildModel: function ( siteModel, data, taxonomy ) {
		// pass the site model and the view specific data into the page model
		var baseModel = pageModel.buildModel( siteModel, data );

		return extend( {}, baseModel, data, {
			posts: postModel.postsByLatest( taxonomy.posts )
		} );
	}
};
