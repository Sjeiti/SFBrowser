angular.module('sfbrowser',['ngResource'])
	.run(function($http,$injector){
		'use strict';
		$injector.get('$compile')(decodeURIComponent('/*include -e ../../../temp/templates.html*/'));
	})
;
/*include service/Key.js*/
/*include service/Api.js*/
/*include service/CreateInstance.js*/