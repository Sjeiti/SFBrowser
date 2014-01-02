angular.module('sfbInstance').controller('sfbMenuController',function($scope,$rootScope) {
	'use strict';
	$scope.filesView = function(){
		$rootScope.$emit('view');
	};
});