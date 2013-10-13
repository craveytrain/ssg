'use strict';

var marked = require('supermarked');
var excerpt = require('../lib/excerpt');
var extend = require('extend');


module.exports = function(baseModel) {
	return function(data) {
		var pageModel = require('../models/page')(baseModel, data);
		data.excerpt = marked(data.excerpt || excerpt(data.__content));

		return extend({}, pageModel, data);
	}
};
