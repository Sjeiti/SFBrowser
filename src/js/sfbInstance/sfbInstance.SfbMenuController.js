angular.module('sfbInstance').controller('SfbMenuController',function($scope,$rootScope) {
	'use strict';
	$scope.filesView = function(){
		$rootScope.$emit('view');
	};
});