'use strict';

var fs = require('fs');
var path = require('path');

var modelBuilders = {};


// go find all the model builders
require('fs').readdirSync(__dirname).forEach(function(file) {
	var base;

	// if it's the index, exit early
	if (file === 'index.js') return;

	// get the module name
	base = path.basename(file, path.extname(file));

	// require the module onto the modelBuilders
	modelBuilders[base] = require('./' + base);
});

module.exports = function() {
	var models = {};

	// loop through the model builders and attach them to the models object
	Object.keys(modelBuilders).forEach(function(pageType) {
		models[pageType] = modelBuilders[pageType];
	});

	return models;
};
