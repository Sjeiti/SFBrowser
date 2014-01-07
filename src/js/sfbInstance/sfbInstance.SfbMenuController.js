angular.module('sfbInstance').controller('SfbMenuController',function(
	$scope
	,$rootScope
	,SfbFilesModel
){
	'use strict';
	$scope.newFolder = function (){
		SfbFilesModel.newFolder(function(success){
			console.log('menuControllerNewFolderCallback'); // log
			if (success) {
				// todo: SfbFileTableController $scope.$apply();
			}
		});
	};
	$scope.upload;
	$scope.files = function(){
		$rootScope.$emit('setPage','files');
	};
	$scope.settings = function(){
		$rootScope.$emit('setPage','settings');
	};
});