'use strict';

var marked = require('supermarked');
var excerpt = require('../lib/excerpt');
var extend = require('extend');


module.exports = function(siteModel) {
	// initialize the page model with the base model content
	var pageModel = require('./page')(siteModel);

	return function(data) {
		// pass the view specific data into the page model
		var baseModel = pageModel(data);

		return extend({}, baseModel, data, {
			// create excerpt if non exists and mark it down
			excerpt: marked(baseModel.excerpt || excerpt(baseModel.content))
		});
	};
};
