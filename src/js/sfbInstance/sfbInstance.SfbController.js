angular.module('sfbInstance').controller('SfbController',function($scope,$rootScope,$element,Api) {
	'use strict';
	var that = this;
	this.layout = 'list';
	this.menuMain = 'menuMain.html';
	this.fileTable = 'fileTable.html';

	this.fullscreen = function(){
		$rootScope.$emit('fullscreen');
	};
	this.close = function(){
		$rootScope.$emit('close');
	};
	this.select = function(){
		$rootScope.$emit('selectFiles');
	};

	$rootScope.$on('view',function(){
		that.layout = that.layout==='grid'?'list':'grid';
	});
	$rootScope.$on('close',function(){
		$element.remove();
	});

});