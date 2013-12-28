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
		,sUriAngularBaseCDN = sUriCDN+'angular.js'
		,sUriAngularResourceCDN = sUriCDN+'angular-resource.js'
		,sUriAngularBase = 'js/vendor/angular.js'
		,sUriAngularResource = 'js/vendor/angular-resource.min.js'
		//
//		,sTemplates = '/*include -esc ../../temp/templates.html*/'
		,sCss = '/*include -esc ../less/sfbrowser.css*/'
		//
		,oSFBInjector
	;
//	132312;
//	console.log('sCss',sCss); // log
//	console.log('sTemplates',sTemplates); // log

	// try to load from CDN or fallback to local files (and one by one or sometimes error)
	window.angular&&initModule()
	||loadScripts([sUriAngularBaseCDN,sUriAngularResourceCDN],true)
		.then(initModule,function (){
			loadScripts([sUriAngularBase,sUriAngularResource],true).then(initModule);
		});
	// and proceed...
	function initModule(){
		var mStyle = document.createElement('style');
		mStyle.innerHTML = decodeURIComponent(sCss);
		document.body.appendChild(mStyle);
		//
		var oSFB = {};
		/*include sfbrowser/sfbrowser.js*/
		angular.bootstrap(oSFB, ['sfbrowser']);
		oSFBInjector = angular.element(oSFB).injector();
		/*include sfbInstance/sfbInstance.js*/
		setTimeout(init,1000);
	}
	function init(){
		oSFBInjector.get('CreateInstance')();
	}
	/*include loadScripts.js*/
	return {
		init: init
	};
})();