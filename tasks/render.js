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
var taxonomy = {};

function determinePageType (data) {
	// if it's specified, go with it
	if (data.pageType) return data.pageType;

	// if it's in the posts directory, it's probably a post
	if (data.pageTaxonomy[0] === 'posts') return 'post';

	// otherwise, it's just a page
	return 'page';
}

function buildModel (data) {
	var modelFile = models[data.pageType] || models.page;

	// build up the model and return it
	return modelFile(data, taxonomy);
}

function buildPageTaxonomy (file) {
	var baseName = path.basename(file, path.extname(file));

	// trim filename
	var pageTaxonomy = path.dirname(file).split(path.sep);

	// trim first directory
	pageTaxonomy.shift();

	// if basename is not index then we need to create a directory
	if (baseName !== 'index') {
		pageTaxonomy.push(baseName);
	}

	grunt.log.debug('page taxonomy:', pageTaxonomy);

	return pageTaxonomy;
}

function sortViews () {
	grunt.config.requires('render.content');
	var content = grunt.config('render').content;

	// Blank queue to start
	var viewQueue = [];

	content.forEach(function(glob) {
		grunt.file.expand(glob).forEach(function(file) {
			grunt.log.debug('file:', file);

			// parse the file
			var data = yamlFront.loadFront(grunt.file.read(file));

			// define the taxomony
			var pageTaxonomy = data.pageTaxonomy = buildPageTaxonomy(file);

			// find out the page type
			var pageType = data.pageType = determinePageType(data);
			grunt.log.debug('page type:', pageType);

			// rudimentary priority queue
			if (pageType === 'post') {
				viewQueue.unshift(data);
			} else {
				viewQueue.push(data);
			}
		});
	});

	// process the views
	processQueue(viewQueue);
}

function populateTaxonomy (model) {
	// set the marker
	var currentView = taxonomy;

	model.pageTaxonomy.forEach(function(dir, i) {
		// if the directory doesn't exist
		if (!currentView.hasOwnProperty(dir)) {
			// if it's the last item in the array, set it to the value, otherwise empty object
			currentView[dir] = {};
		}

		// recursively set the marker
		currentView = currentView[dir];
	});

	// set the data to a key that will get scrubbed out in path.normalize()
	currentView['/'] = model;
}

function processQueue (queue) {
	grunt.config.requires( 'render.target', 'render.templates');
	var target = grunt.config('render').target;
	var templates = grunt.config('render').templates;

	var jadeData = grunt.config('jade');

	queue.forEach(function(data) {
		var model = buildModel(data, taxonomy);
		// build out the path from the pageTaxonomy
		// join only takes comma separated args, so we apply it to send an array
		var pathName = model.pathname = path.normalize('/' + path.join.apply(this, model.pageTaxonomy) + '/');

		populateTaxonomy(model);

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
