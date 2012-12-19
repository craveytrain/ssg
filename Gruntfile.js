module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  jade: {
	compile: {
		options: {
			data: {
				page: {
					title: 'test title',
					description: 'test description',
					author: 'Mike Cravey',
					canonical: 'http://craveytrain.com/path/to/page',
					pageSlug: 'home',
					pageType: 'home',
					body: '<div>foo</div>'
				},
				site: {
					title: 'craveytrain',
					subtitle: "I'm a little geek bot, short and stout…",
					rss: '/atom.xml',
					stylesheet: '/styles.css',
					domain: 'craveytrain.com'
				}
			},
			pretty: true
		},
		files: {
			'build/index.html': 'source/layout.jade'
		}
	}
  },
  server: {
	port: 4000,
	base: './build'
  },
  clean: ['build']
});

grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.registerTask('build', ['clean', 'jade']);

// Default task(s).
grunt.registerTask('default', ['build']);
};