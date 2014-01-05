/* global oSFBInjector */
angular.module('sfbInstance',['ngAnimate','pascalprecht.translate'])
	.constant('Api',oSFBInjector.get('Api'))
	.constant('Key',oSFBInjector.get('Key'))
	.constant('$templateCache',oSFBInjector.get('$templateCache'))
	.config(function($provide,$translateProvider) {
		'use strict';
		angular.forEach(angular.extend({
			directory:''
			,callback: function(files){console.log(files);}
		},/*todo:options*/{}),function(value,key) {
			$provide.value(key,value);
		});
		/*include ../../lang/en.js*/
		/*include ../../lang/nl.js*/
		$translateProvider.preferredLanguage('en');

	})
;
/*include sfbInstance.SfbController.js*/
/*include sfbInstance.SfbFilesModel.js*/
/*include sfbInstance.SfbWindowModel.js*/
/*include sfbInstance.SfbWindowController.js*/
/*include sfbInstance.SfbMenuController.js*/
/*include sfbInstance.SfbFileTableController.js*/
/*include sfbInstance.SfbSettingsController.js*/
/*include sfbInstance.SfbDragDirective.js*/
/*include sfbInstance.SfbResizeDirective.js*/
/*include sfbInstance.SfbFileDropDirective.js*/
