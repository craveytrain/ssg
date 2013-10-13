'use strict';

var marked = require('supermarked');
var extend = require('extend');

marked.aliases = {
	html: 'xml'
};

module.exports = function(baseModel) {
	return function(data) {
		var content = data.__content = data.__content.trim();

		data.body = marked(content);

		return extend({}, baseModel, data);
	}
};
