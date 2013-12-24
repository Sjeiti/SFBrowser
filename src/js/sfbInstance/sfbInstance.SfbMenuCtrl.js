angular.module('sfbInstance').controller('sfbMenuController',function($scope,$rootScope) {
	$scope.filesView = function(){
		$rootScope.$emit('view');
	};
});