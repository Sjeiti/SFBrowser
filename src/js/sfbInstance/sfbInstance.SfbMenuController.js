angular.module('sfbInstance').controller('SfbMenuController',function(
	$scope
	,$rootScope
){
	'use strict';
	$scope.newFolder = function (){	$rootScope.$emit('newFolder');};
	$scope.upload = function(){		$rootScope.$emit('upload');};
	$scope.files = function(){		$rootScope.$emit('setPage','files');};
	$scope.settings = function(){	$rootScope.$emit('setPage','settings');};
});