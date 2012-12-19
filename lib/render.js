module.exports = function(grunt) {
'use strict';

var extend = require('extend');
var path = require('path');

var siteModel = grunt.file.readYAML('site.yml');
var baseModel = {
	title: siteModel.title,
	description: siteModel.description,
	keywords: siteModel.keywords,
	stylesheet: siteModel.stylesheet,
	author: siteModel.author
};

var buildModel = function(page, path) {
	var pageModel = extend(true, {}, baseModel, grunt.file.readYAML(page));

	// TODO: parse paths
	// TODO: parse dates

	// Sensible defaults
	if (typeof pageModel.pageSlug === 'undefined') pageModel.pageSlug = page;

	// TODO: Do markdown conversion

	return {
		site: siteModel,
		page: pageModel
	};
};

var buildPath = function(file) {
	var controller = path.sep;
	var baseName = path.basename(file, path.extname(file));
	var pathName = path.dirname(file).split(path.sep);

	// if deeper than doc root
	if (pathName.length > 1) {
		//  drop the top dir
		pathName.shift();
		controller += pathName.join(path.sep) + path.sep;
	}

	// if it's not an index file
	if (baseName !== 'index') {
		controller += baseName + path.sep;
	}

	return controller;
};


var buildJadeData = function() {
	grunt.config.requires('render.content', 'render.target', 'render.templates');
	var config = grunt.config('render');
	var content = config.content;
	var target = config.target;
	var templates = config.templates;
	var jadeData = grunt.config('jade');


	content.forEach(function(glob) {
		grunt.file.expandFiles(glob).forEach(function(file) {
			var controller = buildPath(file);

			// Set model data
			jadeData[controller] = {
				options: {
					data: buildModel(file, controller)
				},
				files: {}
			};

			// Set templates and output files
			jadeData[controller].files[target + controller + 'index.html'] = templates + path.sep + 'layout.jade';

			// Set canonical url
			jadeData[controller].options.data.page.canonical = 'http://' + siteModel.domain + controller;

		});
	});

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};