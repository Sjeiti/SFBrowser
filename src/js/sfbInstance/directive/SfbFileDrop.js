angular.module('sfbInstance').directive('sfbFileDrop', function($rootScope) {
	'use strict';
	// http://jsfiddle.net/vishalvasani/4hqVu/
	// http://jsfiddle.net/winduptoy/QhA3q/
	// http://angular-file-upload.appspot.com/
	function link(scope, element) {
		element[0].addEventListener('dragover', handleStop, false);
		element[0].addEventListener('drop', handleDrop, false);
		function handleStop(e){
			e.stopPropagation();
			e.preventDefault();
		}

		function handleDrop(e){
			e.stopPropagation();
			e.preventDefault();
			$rootScope.$emit('uploadDrop',e.dataTransfer.files);
		}
	}
	return { link: link };
});