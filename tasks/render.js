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

function determinePageType (data, path) {
	// if it's specified, go with it
	if (data.pageType) return data.pageType;

	// if it's in the posts directory, it's probably a post
	if (/^\/posts\//.test(path)) return 'post';

	// otherwise, it's just a page
	return 'page';
}

function buildModel (data) {
	var modelFile = models[data.pageType] || models.page;

	// build up the model and return it
	return modelFile(data);
}

function buildPath (file) {
	var baseName = path.basename(file, path.extname(file));

	// trim first directory and filename
	var pathName = path.dirname(file.substring(file.indexOf(path.sep)));

	// if basename is not index then we need to create a directory
	if (baseName !== 'index') {
		pathName = path.join(pathName, baseName) + path.sep;
	}

	grunt.log.debug('path name:', pathName);

	return pathName;
}

function sortViews () {
	grunt.config.requires('render.content');
	var content = grunt.config('render').content;

	// Blank queue to start
	var viewQueue = [];

	content.forEach(function(glob) {
		grunt.file.expand(glob).forEach(function(file) {
			grunt.log.debug('file:', file);

			// define path
			var path = buildPath(file);

			// parse the file
			var data = yamlFront.loadFront(grunt.file.read(file));

			// find out the page type
			var pageType = data.pageType = determinePageType(data, path);
			grunt.log.debug('page type:', pageType);

			var view = {
				pathName: path,
				data: data
			};

			// rudimentary sorting
			if (pageType === 'post') {
				viewQueue.unshift(view);
			} else {
				viewQueue.push(view);
			}
		});
	});

	// process the queue
	processQueue(viewQueue);
}

function processQueue (queue) {
	grunt.config.requires( 'render.target', 'render.templates');
	var target = grunt.config('render').target;
	var templates = grunt.config('render').templates;

	var jadeData = grunt.config('jade');

	queue.forEach(function(view) {
		var pathName = view.pathName;
		var model = buildModel(view.data);

		// Set model data
		jadeData[pathName] = {
			options: {
				data: model
			},
			files: {}
		};

		// Set templates and output files
		jadeData[pathName].files[target + pathName + 'index.html'] = templates + path.sep + model.pageType + '.jade';

		// Set canonical url
		jadeData[pathName].options.data.canonical = 'http://' + siteModel.domain + pathName;
	});

	// Store it all in the config for jade
	grunt.config('jade', jadeData);
}

grunt.registerTask('buildJadeData', 'Parse the markdown and render the markup from the template', sortViews);

grunt.registerTask('render', ['buildJadeData', 'jade']);

};
