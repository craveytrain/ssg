'use strict';

var fs = require( 'fs' );
var yaml = require( 'js-yaml' );

var i = 0;

var siteConfigs = yaml.load( fs.readFileSync( './site.yml' ) );

module.exports = function () {
	return siteConfigs;
};
