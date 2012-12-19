module.exports = function(grunt) {
'use strict';

var siteContent = grunt.file.readYAML('site.yml');

var buildModel = function(page) {
	var pageModel = grunt.file.readYAML('content/' + page + '.yml');

	// TODO: parse paths
	// TODO: parse dates

	// Sensible defaults
	if (typeof pageModel.pageSlug === 'undefined') pageModel.pageSlug = page;
	if (typeof pageModel.author === 'undefined') pageModel.author = siteContent.author;
	if (typeof pageModel.keywords === 'undefined') pageModel.keywords = siteContent.keywords;
	if (typeof pageModel.stylesheet === 'undefined') pageModel.stylesheet = siteContent.stylesheet;



	pageModel.canonical = 'http://' + siteContent.domain + page + '.html';

	// TODO: Do markdown conversion

	return {
		site: siteContent,
		page: pageModel
	};
};


var buildJadeData = function() {
	var jadeData = grunt.config('jade');
	// foreach
	var page = 'index';

	jadeData[page] = {
		options: {
			data: buildModel(page)
		},
		files: {}
	};

	jadeData[page].files['build/' + page + '.html'] = 'templates/layout.jade';

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};