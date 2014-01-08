angular.module('sfbrowser').factory('CreateInstance',function($templateCache){
	'use strict';
	return function(config){
		//
		var mElement
			,sCheckId = config.id||(config.id='SFBrowser')
			,bExists = !!document.getElementById(sCheckId);
		if (!bExists) {
			angular.module('sfbInstanceConfig',[]).value('parsedConfig', config);
			//
			mElement = angular.element($templateCache.get('sfbrowser.html'))[0];
			angular.bootstrap(mElement, ['sfbInstance','sfbInstanceConfig']);
			//
			var mStyle = document.createElement('style');
			mStyle.innerHTML = decodeURIComponent('/*include -e ../../../less/sfbrowser.css*/');
			mElement.appendChild(mStyle);
			//
			document.body.appendChild(mElement);
		}
		return mElement;
	};
});