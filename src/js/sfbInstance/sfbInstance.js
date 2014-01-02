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
/*include sfbInstance.SfbController.js*/
/*include sfbInstance.SfbWindowModel.js*/
/*include sfbInstance.SfbWindowController.js*/
/*include sfbInstance.SfbMenuController.js*/
/*include sfbInstance.SfbFileTableController.js*/
/*include sfbInstance.SfbDragDirective.js*/
/*include sfbInstance.SfbResizeDirective.js*/
