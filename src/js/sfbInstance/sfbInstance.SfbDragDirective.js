angular.module('sfbInstance').directive('sfbDrag', function(SfbWindowModel) {
	'use strict';
	function link(scope, element, attrs) {
		var mElement = element[0]
			,iOffsetX
			,iOffsetY
			,sEmit = attrs.sfbDrag
		;
		mElement.addEventListener('mousedown',handleElementMouseDown,false);
		function handleElementMouseDown(e){
			var iScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
			var iScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
			iOffsetX = e.offsetX+iScrollX;
			iOffsetY = e.offsetY+iScrollY;
			document.addEventListener('mousemove',handleDocumentMouseMove,false);
			document.addEventListener('mouseup',handleDocumentMouseUp,false);
		}
		function handleDocumentMouseUp(){
			document.removeEventListener('mousemove',handleDocumentMouseMove);
			document.removeEventListener('mousemove',handleDocumentMouseUp);
		}
		function handleDocumentMouseMove(e){
			console.log('iOffsetY',iOffsetY); // log
			SfbWindowModel.drag(sEmit,e.pageX-iOffsetX,e.pageY-iOffsetY);
		}
	}
	return { link: link };
});