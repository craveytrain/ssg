module.exports = function(grunt) {
'use strict';



var buildContent = function() {
	var siteContent = grunt.file.readJSON('site.json');
	var jadeData = grunt.config('jade');
	// foreach
	var page = 'index';

	jadeData[page] = {
		options: {
			data: {
				page: grunt.file.readJSON('content/index.json'),
				site: siteContent
			}
		},
		files: {}
	};

	jadeData[page].files['build/' + page + '.html'] = 'source/layout.jade';

	// console.log(jadeData);

	grunt.config('jade', jadeData);
};


grunt.registerTask('buildContent', 'Parse the markdown and render the markup from the template', buildContent);

grunt.registerTask('render', ['buildContent', 'jade']);

};