angular.module('sfbrowser',['ngResource'])
	.run(function($http,$injector){
		'use strict';
		$injector.get('$compile')(decodeURIComponent('/*include -e ../../../temp/templates.html*/'));
	})
;
/*include sfbrowser.Key.js*/
/*include sfbrowser.Api.js*/
/*include sfbrowser.CreateInstance.js*/