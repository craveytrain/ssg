module.exports = function(grunt) {
'use strict';

var extend = require('extend');
var jsYAML = require('js-yaml');
var path = require('path');
var reYAMLFM = /^\-{3}([\w\W]+)\-{3}([\w\W]*)/;

var siteModel = grunt.file.readYAML('site.yml');
var baseModel = require('../models/page')(siteModel);

function determinePageType(data, page, path) {
	// if it's specified, go with it
	if (data.pageType) return data.pageType;

	// if it's in the posts directory, it's probably a post
	if (/^\/posts\//.test(path)) return 'post';

	// if it's just /, it's home dummy
	if (/^\/$/.test(path)) return 'home';

	// otherwise, it's just a page
	return 'page';
}

var buildModel = function(page, path) {
	// split file contents into frontmatter and non
	var fileContents = reYAMLFM.exec(grunt.file.read(page));

	// parse out YAML
	var data = jsYAML.load(fileContents[1]);

	// body is the rest of the file
	data.body = fileContents[2];

	if (!data.pageType) {
		data.pageType = determinePageType(data, page, path);
	}

	grunt.log.debug('page type:', data.pageType);

	// return the right time of model
	return require('../models/' + data.pageType)(baseModel, data);
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
