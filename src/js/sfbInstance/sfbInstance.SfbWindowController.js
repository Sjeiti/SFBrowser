angular.module('sfbInstance').controller('SfbWindowController',function($scope,$rootScope,$element,SfbWindowModel,$timeout) {
	'use strict';

	var mElement = $element[0]
		,oStyle = mElement.style
	;

    this.windowModel = SfbWindowModel;

	$rootScope.$on('fullscreen',SfbWindowModel.toggleFullscreen);
	$rootScope.$on('windowModelChange',handleWindowModelChange);

	function handleWindowModelChange(){
		if (mElement.offsetHeight!==SfbWindowModel.h) {
			oStyle.height = SfbWindowModel.h+'px';
			$rootScope.$emit('heightChanged',mElement.offsetHeight);
		}
		if (mElement.offsetWidth!==SfbWindowModel.w) {
			oStyle.width = SfbWindowModel.w+'px';
			$rootScope.$emit('widthChanged',mElement.offsetWidth);
		}
		if (mElement.offsetLeft!==SfbWindowModel.x) {
			oStyle.left = SfbWindowModel.x+'px';
		}
		if (mElement.offsetTop!==SfbWindowModel.y) {
			oStyle.top = SfbWindowModel.y+'px';
		}
		$timeout(function() {
			$scope.$apply();
		});
	}
	$timeout(handleWindowModelChange);
});