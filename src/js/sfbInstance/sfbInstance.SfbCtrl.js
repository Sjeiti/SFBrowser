angular.module('sfbInstance').controller('SfbCtrl',function($scope,$rootScope,$element,Api) {
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

	//
	// //
	//
	// http://jsfiddle.net/vishalvasani/4hqVu/
	// http://jsfiddle.net/winduptoy/QhA3q/
	// http://angular-file-upload.appspot.com/


	$element[0].addEventListener('dragover', handleStop, false);
	$element[0].addEventListener('drop', handleDrop, false);

	function handleStop(e){
		e.stopPropagation();
		e.preventDefault();
	}

	function handleDrop(e){
		e.stopPropagation();
		e.preventDefault();
		$rootScope.$emit('upload',e.dataTransfer.files);
	}

});