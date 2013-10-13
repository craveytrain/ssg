module.exports = function(grunt) {
'use strict';

var path = require('path');
var fs = require('fs');

var extend = require('extend');
var jsYAML = require('js-yaml');
var yamlFront = require('yaml-front-matter');
var modelBuilder = require('../models');

var siteModel = grunt.file.readYAML('site.yml');
var models = modelBuilder(siteModel);

function determinePageType(data, page, path) {
	// if it's specified, go with it
	if (data.pageType) return data.pageType;

	// if it's in the posts directory, it's probably a post
	if (/^\/posts\//.test(path)) return 'post';

	// otherwise, it's just a page
	return 'page';
}

var buildModel = function(page, path) {
	// split file contents into YAML front matter and content
	var data = yamlFront.loadFront(grunt.file.read(page));
	var modelFile;

	if (!data.pageType) {
		data.pageType = determinePageType(data, page, path);
	}

	modelFile = models[data.pageType] || models.page;

	grunt.log.debug('page type:', data.pageType);

	return modelFile(data);
};

var buildPath = function(file) {
	var baseName = path.basename(file, path.extname(file));

	// trim first directory and filename
	var pathName = path.dirname(file.substring(file.indexOf(path.sep)));

	// if basename is not index then we need to create a directory
	if (baseName !== 'index') {
		pathName = path.join(pathName, baseName) + path.sep;
	}

	grunt.log.debug('path name:', pathName);

	return pathName;
};

var buildJadeData = function() {
	grunt.config.requires('render.content', 'render.target', 'render.templates');
	var config = grunt.config('render');
	var content = config.content;
	var target = config.target;
	var templates = config.templates;
	var jadeData = grunt.config('jade');

	content.forEach(function(glob) {
		grunt.file.expand(glob).forEach(function(file) {
			grunt.log.debug('file:', file);

			var pathName = buildPath(file);
			var model = buildModel(file, pathName);

			// Set model data
			jadeData[pathName] = {
				options: {
					data: model
				},
				files: {}
			};

			// Set templates and output files
			jadeData[pathName].files[target + pathName + 'index.html'] = templates + path.sep + model.pageType + '.jade';

			// // Set canonical url
			jadeData[pathName].options.data.canonical = 'http://' + siteModel.domain + pathName;

		});
	});

	grunt.config('jade', jadeData);
};

grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', buildJadeData);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};
