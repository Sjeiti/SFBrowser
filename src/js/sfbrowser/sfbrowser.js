angular.module('sfbrowser',['ngResource'])
	/*.config(function($provide, $compileProvider, $filterProvider){
	})*/
	.run(function($http,$injector){
		'use strict';
		$http.get('sfbrowser.html').success(function(response){
			$injector.get('$compile')(response);
		});
	})
//	.factory('createSfbElement',function($templateCache){
//		return function(){
//			var mElement = angular.element($templateCache.get('sfbrowser.html'))[0];
//			document.body.appendChild(mElement);
//			return mElement;
//		};
//	})
;
/*include sfbrowser.Key.js*/
/*include sfbrowser.Api.js*/
/*include sfbrowser.CreateInstance.js*/