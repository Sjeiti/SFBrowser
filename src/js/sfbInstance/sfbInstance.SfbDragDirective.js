angular.module('sfbInstance').directive('sfbDrag', function($rootScope,SfbWindowModel) {
	'use strict';
	function link(scope, element, attrs) {
		var mElement = element[0]
			,iOffsetX
			,iOffsetY
			,sEmit = attrs.sfbDrag
			,mBody = document.body
		;
		mElement.addEventListener('mousedown',handleElementMouseDown,false);
		function handleElementMouseDown(e){
			iOffsetX = e.offsetX-mBody.scrollLeft;
			iOffsetY = e.offsetY-mBody.scrollTop;
			document.addEventListener('mousemove',handleDocumentMouseMove,false);
			document.addEventListener('mouseup',handleDocumentMouseUp,false);
		}
		function handleDocumentMouseUp(){
			document.removeEventListener('mousemove',handleDocumentMouseMove);
			document.removeEventListener('mousemove',handleDocumentMouseUp);
		}
		function handleDocumentMouseMove(e){
			SfbWindowModel.drag(sEmit,e.pageX-iOffsetX,e.pageY-iOffsetY);
		}
	}
	return { link: link };
});