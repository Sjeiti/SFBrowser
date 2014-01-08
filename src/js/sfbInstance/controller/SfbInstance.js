angular.module('sfbInstance').controller('SfbInstance',function(
	$scope
	,$rootScope
	,$element
	,SfbConfig
) {
	'use strict';
	var that = this
		,sFilesPage = 'files';
	this.layout = 'list';
	this.menuMain = 'menuMain.html';
	this.fileTable = 'fileTable.html';
	this.settings = 'settings.html';
	this.id = SfbConfig.id;
	console.log('this.id',this.id); // log

	this.page = 'files';

	this.fullscreen = function(){
		$rootScope.$emit('fullscreen');
	};
	this.close = function(){
		$rootScope.$emit('close');
	};
	this.select = function(){
		$rootScope.$emit('selectFiles');
	};

	$rootScope.$on('close',function(){
		$element.remove();
	});
	$rootScope.$on('setPage',function(asdf,page){
		if (that.page!==page) {
			that.page = page;
		} else if (page===sFilesPage) {
			that.layout = that.layout==='grid'?'list':'grid';
		} else {
			that.page = sFilesPage;
		}
	});

});