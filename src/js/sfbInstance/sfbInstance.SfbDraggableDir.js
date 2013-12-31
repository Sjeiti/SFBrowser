angular.module('sfbInstance').directive('draggable', function($rootScope) {
	'use strict';
	function link(scope, element, attrs) {
		var mElement = element[0]
			,iOffsetX
			,iOffsetY
			,sEmit = attrs.draggable
			,mBody = document.body
			//,oBodyClass = mBody.classList
		;
		mElement.addEventListener('mousedown',handleElementMouseDown,false);
		function handleElementMouseDown(e){
			iOffsetX = e.offsetX-mBody.scrollLeft;
			iOffsetY = e.offsetY-mBody.scrollTop;
			document.addEventListener('mousemove',handleDocumentMouseMove,false);
			document.addEventListener('mouseup',handleDocumentMouseUp,false);
//			oBodyClass.add('userSelectNone');
		}
		function handleDocumentMouseUp(){
			document.removeEventListener('mousemove',handleDocumentMouseMove);
			document.removeEventListener('mousemove',handleDocumentMouseUp);
//			oBodyClass.remove('userSelectNone');
		}
		function handleDocumentMouseMove(e){
//			element.css({border:'1px solid red'});
//			angular.element(scope).css({border:'1px solid red'});
//			console.log('$rootScope',$rootScope); // log
			$rootScope.$emit(sEmit,e.pageX-iOffsetX,e.pageY-iOffsetY);
		}
	}
	return { link: link };
});