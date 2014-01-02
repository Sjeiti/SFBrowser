angular.module('sfbInstance').factory( 'SfbWindowModel', function($rootScope) {
	'use strict';
	var  xMax = 300
		,yMax = 300
		,sw = 100
		,sh = 100
		,bFullScreen = false
		,iLastX
		,iLastY
		,iLastW
		,iLastH
		,oReturn = {
			x: 10
			,y: 100
			,w: 500
			,h: 300
			,windowResize: windowResize
			,drag: drag
			,toggleFullscreen: toggleFullscreen
		}
	;
	function windowResize(w,h){
		sw = w;
		sh = h;
		setMax();
	}
	function drag(type,x,y){
		switch (type) {
			case 'move':			moveXY(x,y); break;
			case 'resize-t':		resizeYH(y); break;
			case 'resize-tr':		resizeYH(y);
			/* falls through */
			case 'resize-r':		resizeW(x); break;
			case 'resize-bl':		resizeXW(x);
			/* falls through */
			case 'resize-b':		resizeH(y); break;
			case 'resize-tl':		resizeYH(y);
			/* falls through */
			case 'resize-l':		resizeXW(x); break;
			case 'resize-br':
				resizeW(x);
				resizeH(y);
		}
		$rootScope.$emit('windowModelChange');
	}
	function toggleFullscreen(){
		bFullScreen = !bFullScreen;
		if (bFullScreen) {
			iLastX = oReturn.x;
			iLastY = oReturn.y;
			iLastW = oReturn.w;
			iLastH = oReturn.h;
			oReturn.x = oReturn.y = 0;
			oReturn.w = sw;
			oReturn.h = sh;
		} else {
			oReturn.x = iLastX;
			oReturn.y = iLastY;
			oReturn.w = iLastW;
			oReturn.h = iLastH;
		}
		$rootScope.$emit('windowModelChange');
	}
	////////////////////////////////////////////////////////////
	function moveXY(x,y){
		oReturn.x = Math.min(Math.max(x,0),xMax);
		oReturn.y = Math.min(Math.max(y,0),yMax);
	}
	function resizeW(x){
		oReturn.w = Math.min(x,sw)-oReturn.x;
		setMaxX();
	}
	function resizeH(y){
		oReturn.h = Math.min(y,sh)-oReturn.y;
		setMaxY();
	}
	function resizeXW(x){
		var iOff = Math.max(x,0)-oReturn.x;
		oReturn.x += iOff;
		oReturn.w -= iOff;
		setMaxX();
	}
	function resizeYH(y){
		var iOff = Math.max(y,0)-oReturn.y;
		oReturn.y += iOff;
		oReturn.h -= iOff;
		setMaxY();
	}
	function setMax(){
		setMaxX();
		setMaxY();
	}
	function setMaxX(){
		xMax = sw-oReturn.w;
	}
	function setMaxY(){
		yMax = sh-oReturn.h;
	}
	return oReturn;
});