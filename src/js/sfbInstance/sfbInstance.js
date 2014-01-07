/* global oSFBInjector */
angular.module('sfbInstance',['ngAnimate','pascalprecht.translate'])
	.constant('$templateCache',oSFBInjector.get('$templateCache'))
	.config(function($translateProvider) {
		'use strict';
		/*include ../../lang/en.js*/
		/*include ../../lang/nl.js*/
		$translateProvider.preferredLanguage('en');
	})
	.value('config',{
		directory: ''
		,callback: function(files){
			'use strict';
			console.log(files);
		}
		,lang: 'en'
		,x:0
		,y:0
		,w:0
		,h:0
	})
	.run(function(config,parsedConfig,$translate,SfbLocalStorageModel){
		'use strict';
		// todo:
		// 	- load from localStorage
		//	- extend config with localStorage
		//  - extend config with parsedConfig
		angular.extend(config,parsedConfig);
		console.log('SfbLocalStorageModel.get()',SfbLocalStorageModel.get('x')); // log
		//
		if ($translate.uses()!==config.lang) {
			$translate.uses(config.lang);
		}
	})
;

/*include sfbInstance.SfbLocalStorageModel.js*/
/*include sfbInstance.SfbFilesModel.js*/
/*include sfbInstance.SfbWindowModel.js*/

/*include sfbInstance.SfbController.js*/
/*include sfbInstance.SfbWindowController.js*/
/*include sfbInstance.SfbMenuController.js*/
/*include sfbInstance.SfbFileTableController.js*/
/*include sfbInstance.SfbSettingsController.js*/

/*include sfbInstance.SfbDragDirective.js*/
/*include sfbInstance.SfbResizeDirective.js*/
/*include sfbInstance.SfbFileDropDirective.js*/
