angular.module('sfbrowser').factory('CreateInstance',function($templateCache){
	'use strict';
	return function(config){
		//
        angular.module('sfbInstanceConfig',[]).value('parsedConfig', config);
		//
		var mElement = angular.element($templateCache.get('sfbrowser.html'))[0];
		angular.bootstrap(mElement, ['sfbInstance','sfbInstanceConfig']);
		//
		var mStyle = document.createElement('style');
		mStyle.innerHTML = decodeURIComponent('/*include -e ../../less/sfbrowser.css*/');
		mElement.appendChild(mStyle);
		//
		document.body.appendChild(mElement);
		//
		return mElement;
	};
});