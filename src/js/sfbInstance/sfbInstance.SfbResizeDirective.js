angular.module('sfbInstance').directive('sfbResize', function($window,$document,SfbWindowModel) {
	'use strict';
	function link() {
		var mBody = $document.find('body')[0];
		$window.addEventListener('resize',handleWindowResize,false);
		function handleWindowResize(){
			SfbWindowModel.windowResize(
				Math.min($window.innerWidth,mBody.clientWidth)
				,Math.min($window.innerHeight,mBody.clientHeight)
			);
		}
		handleWindowResize();
	}
	return { link: link };
});