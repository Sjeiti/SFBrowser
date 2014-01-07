/* global loadScripts */
/**
 * @name sfbrowser
 * @version 4.0.65
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
if (window.sfbrowser===undefined) window.sfbrowser = (function () {
	'use strict';
	var sUriCDN = '//ajax.googleapis.com/ajax/libs/angularjs/1.2.5/'
		//
		,sUriAngularBaseCDN = sUriCDN+'angular.js'
		,sUriAngularResourceCDN = sUriCDN+'angular-resource.js'
		,sUriAngularAnimateCDN = sUriCDN+'angular-animate.js'
		//
		,sUriAngularBase = 'js/vendor/angular.js'
		,sUriAngularResource = 'js/vendor/angular-resource.min.js'
		,sUriAngularAnimate = 'js/vendor/angular-animate.min.js'
		//
		,oSFBInjector
	;

	//console.log('base64','/*include -b ../less/fileSheet.png*/'); // log
	//console.log('base64','/*include -b ../less/iconSheet.png*/'); // log

	// try to load from CDN or fallback to local files (and one by one or sometimes error)
	window.angular&&initModule()
	||loadScripts([sUriAngularBaseCDN,sUriAngularResourceCDN,sUriAngularAnimateCDN],true)
		.then(initModule,function (){
			loadScripts([sUriAngularBase,sUriAngularResource,sUriAngularAnimate],true).then(initModule);
		});
	// and proceed...
	function initModule(){
		var oSFB = {};

		/*include vendor/angular-translate.min.js*/
		/*include sfbrowser/sfbrowser.js*/
		angular.bootstrap(oSFB, ['sfbrowser']);
		oSFBInjector = angular.element(oSFB).injector();
		/*include sfbInstance/sfbInstance.js*/
	}
	function init(config){
		oSFBInjector.get('CreateInstance')(config);
	}
	/*include loadScripts.js*/
	return {
		init: init
	};
})();