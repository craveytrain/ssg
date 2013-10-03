var marked = require('marked');
var excerpt = require('../lib/excerpt');
var extend = require('extend');

marked.setOptions({
	gfm: true,
	pedantic: false,
	sanitize: true
	// callback for code highlighter
	// highlight: function(code, lang) {
	// 	return hl(code);
	// }
});


module.exports = function(baseModel, data) {
	var body = data.body.trim();
	data.excerpt = marked(data.excerpt || excerpt(data.body));

	data.body = marked(body);

	return extend({}, baseModel, data);
}
