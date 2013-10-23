'use strict';

var marked = require('supermarked');
var excerpt = require('../lib/excerpt');
var extend = require('extend');

var pageModel = require('./page');

var getPosts = (function(posts) {
	return function (taxonomyPosts) {
		// if there are no posts, populate the posts array
		if (!posts.length) {
			Object.keys(taxonomyPosts).forEach(function(slug) {
				posts.push(taxonomyPosts[slug]['/']);
			});
		}

		return posts;
	};
}([]));

function postsByLatest (taxonomyPosts) {
	var posts = getPosts(taxonomyPosts);

	return posts.sort(function(a, b) {
		return a.date - b.date;
	});
}

function latestPost (taxonomyPosts) {
	var posts = postsByLatest(taxonomyPosts);

	return posts[0];
}

module.exports = {
	buildModel: function (siteModel, data, taxonomy) {
		// pass the site model and the view specific data into the page model
		var baseModel = pageModel.buildModel(siteModel, data);

		return extend({}, baseModel, data, {
			// create excerpt if non exists and mark it down
			excerpt: baseModel.excerpt || excerpt(baseModel.content)
		});
	},
	postsByLatest: postsByLatest,
	latestPost: latestPost
};
