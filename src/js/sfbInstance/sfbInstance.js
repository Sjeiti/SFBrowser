/* global oSFBInjector */
angular.module('sfbInstance',[])
	.constant('Api',oSFBInjector.get('Api'))
	.constant('$templateCache',oSFBInjector.get('$templateCache'))
	.constant('Key',oSFBInjector.get('Key'))
	.config(function($provide) {
		'use strict';
		angular.forEach(angular.extend({
			directory:''
			,callback: function(files){console.log(files);}
		},/*options*/{}),function(value,key) {
			$provide.value(key,value);
		});
	})
;
/*include sfbInstance.SfbCtrl.js*/
/*include sfbInstance.SfbWindowCtrl.js*/
/*include sfbInstance.SfbMenuCtrl.js*/
/*include sfbInstance.SfbFileTableCtrl.js*/
/*include sfbInstance.SfbDraggableDir.js*/
