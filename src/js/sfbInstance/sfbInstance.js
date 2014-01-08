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

/*include model/SfbConfig.js*/
/*include model/SfbFilesModel.js*/
/*include model/SfbWindowModel.js*/

/*include controller/SfbInstance.js*/
/*include controller/SfbWindow.js*/
/*include controller/SfbMenu.js*/
/*include controller/SfbFileTable.js*/
/*include controller/SfbSettings.js*/

/*include directive/SfbDrag.js*/
/*include directive/SfbResize.js*/
/*include directive/SfbFileDrop.js*/
/*include directive/SfbEditName.js*/
/*include directive/SfbIconPosition.js*/
