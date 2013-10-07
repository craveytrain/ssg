'use strict';

var marked = require('marked');
var excerpt = require('../lib/excerpt');
var extend = require('extend');

marked.setOptions({
	gfm: true,
	pedantic: false,
	sanitize: true
});


module.exports = function(baseModel, data) {
	var content = data.__content.trim();
	data.excerpt = marked(data.excerpt || excerpt(content));

	data.__content = marked(content);

	return extend({}, baseModel, data);
};
