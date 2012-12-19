module.exports = function(grunt) {
'use strict';

var extend = require('extend');

var siteModel = grunt.file.readYAML('site.yml');
var baseModel = {
	title: siteModel.title,
	description: siteModel.description,
	keywords: siteModel.keywords,
	stylesheet: siteModel.stylesheet,
	author: siteModel.author
};

var buildModel = function(page) {
	var pageModel = extend(true, {}, baseModel, grunt.file.readYAML('content/' + page + '.yml'));

	// TODO: parse paths
	// TODO: parse dates

	// Sensible defaults
	if (typeof pageModel.pageSlug === 'undefined') pageModel.pageSlug = page;


	pageModel.canonical = 'http://' + baseModel.domain + page + '.html';

	// TODO: Do markdown conversion

	return {
		site: siteModel,
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