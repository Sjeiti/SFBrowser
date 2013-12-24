/**
 * @name sfbrowser
 * @version 4.0.64
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
if (window.sfbrowser===undefined) window.sfbrowser = (function () {
	var sUriCDN = '//ajax.googleapis.com/ajax/libs/angularjs/1.2.5/'
		,sUriAngularBaseCDN = sUriCDN+'angular.js'
		,sUriAngularResourceCDN = sUriCDN+'angular-resource.js'
		,sUriAngularBase = 'js/vendor/angular.js'
		,sUriAngularResource = 'js/vendor/angular-resource.min.js'
		,sUriCSS = 'css/sfbrowser.css'
		,sUriTemplates = 'sfbrowser.html'
		,sUriAPI = 'connector/php'
		//
		,oSFBInjector
	;
	// try to load from CDN or fallback to local files (and one by one or sometimes error)
	window.angular&&initCSS()
	||loadScripts([sUriAngularBaseCDN,sUriAngularResourceCDN],true)
		.then(initCSS,function (){
			loadScripts([sUriAngularBase,sUriAngularResource],true).then(initCSS);
		});
	// and proceed...
	function initCSS(){
		loadScripts(sUriCSS).then(initModule);
	}
	function initModule(){
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