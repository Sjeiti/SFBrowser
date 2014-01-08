/* global oSFBInjector */
angular.module('sfbInstance',['ngAnimate','pascalprecht.translate'])
	.constant('$templateCache',oSFBInjector.get('$templateCache'))
	.config(function($translateProvider) {
		'use strict';
		/*include ../../lang/en.js*/
		/*include ../../lang/nl.js*/
		$translateProvider.preferredLanguage('en');
	})
	.run(function(
			SfbConfig
			,$translate
		){
		'use strict';
		// check lang on config
		if ($translate.uses()!==SfbConfig.lang) {
			$translate.uses(SfbConfig.lang);
		}
	})
;

/*include sfbInstance.SfbConfig.js*/
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
/*include sfbInstance.SfbEditNameDirective.js*/
/*include sfbInstance.SfbIconPositionDirective.js*/
