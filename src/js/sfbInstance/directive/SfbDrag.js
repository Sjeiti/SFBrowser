angular.module('sfbInstance').directive('sfbDrag', function(SfbWindowModel,$rootScope) {
	'use strict';
	function link(scope, element, attrs) {
		var mElement = element[0]
			,iOffsetX
			,iOffsetY
			,iStartX
			,iStartY
			,iMoveX
			,iMoveY
			,sEmit = attrs.sfbDrag
			,bMoveFiles = sEmit==='move-files'
			,bDragging = false
		;
		mElement.addEventListener('mousedown',handleElementMouseDown,false);
		function handleElementMouseDown(e){
			var iScrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
			var iScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
			iOffsetX = e.offsetX+iScrollX;
			iOffsetY = e.offsetY+iScrollY;
			iStartX = e.pageX-iOffsetX;
			iStartY = e.pageY-iOffsetY;
			document.addEventListener('mousemove',handleDocumentMouseMove,false);
			document.addEventListener('mouseup',handleDocumentMouseUp,false);
		}
		function handleDocumentMouseUp(e){
			document.removeEventListener('mousemove',handleDocumentMouseMove);
			document.removeEventListener('mousemove',handleDocumentMouseUp);
			if (bMoveFiles&&bDragging) {
				$rootScope.$emit(sEmit+'-end',iMoveX,iMoveY,e.target);
			}
			bDragging = false;
		}
		function handleDocumentMouseMove(e){
			iMoveX = e.pageX-iOffsetX;
			iMoveY = e.pageY-iOffsetY;
			if (bMoveFiles) {
				var iDiffX = iMoveX-iStartX
					,iDiffY = iMoveY-iStartY
					,fDist = Math.sqrt(iDiffX*iDiffX+iDiffY*iDiffY);
				if (fDist>10) {
					if (!bDragging)	$rootScope.$emit(sEmit+'-start',iMoveX,iMoveY,e.target);
					else			$rootScope.$emit(sEmit,iMoveX,iMoveY);
					bDragging = true;
				}
			} else {
				SfbWindowModel.drag(sEmit,iMoveX,iMoveY);
				bDragging = true;
			}
		}
	}
	return { link: link };
});