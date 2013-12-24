angular.module('sfbrowser').factory('CreateInstance',function($templateCache){
	return function(){
		var mElement = angular.element($templateCache.get('sfbrowser.html'))[0];
		angular.bootstrap(mElement, ['sfbInstance']);
		document.body.appendChild(mElement);
		return mElement;
	};
});