'use strict';

var extend = require('extend');

function postsByLatest (posts) {
	var arr = [];

	Object.keys(posts).forEach(function(slug) {
		arr.push(posts[slug]['/']);
	});

	return arr.sort(function(a, b) {
		return a.date - b.date;
	});
}

module.exports = function(siteModel) {
	// initialize the page model with the base model content
	var pageModel = require('./page')(siteModel);

	return function(data, taxonomy) {
		// pass the view specific data into the page model
		var baseModel = pageModel(data);

		return extend({}, baseModel, data, {
			posts: postsByLatest(taxonomy.posts)
		});
	};
};
