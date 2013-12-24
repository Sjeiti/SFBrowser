angular.module('sfbrowser',['ngResource'])
	.config(function($provide, $compileProvider, $filterProvider){
	})
	.run(function($http,$injector){
		$http.get(sUriTemplates).success(function(response){
			$injector.get('$compile')(response);
		});
	})
//	services.factory('Api',['$resource',function ($resource) {
//		return {
//			Recipe: $resource('/recipes/:id',{id: '@id'}),
//			Users: $resource('/users/:id',{id: '@id'}),
//			Group: $resource('/groups/:id',{id: '@id'})
//		};
//	}]);
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