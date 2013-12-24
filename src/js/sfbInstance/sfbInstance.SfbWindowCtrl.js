angular.module('sfbInstance').controller('SfbWindowCtrl',function($scope,$rootScope,$element) {
	'use strict';
	var xMax = 300
		,yMax = 300
		,sw = 300
		,sh = 300
		,iX = 100
		,iY = 100
		,iW = 600
		,iH = 300
		,bFullScreen = false
		,iLastX = 100
		,iLastY = 100
		,iLastW = 600
		,iLastH = 300;

	handleWindowResize();
	setWindowPos();
	window.addEventListener('resize',handleWindowResize,false);

	$rootScope.$on('fullscreen',function(){
		bFullScreen = !bFullScreen;
		if (bFullScreen) {
			iLastX = iX;
			iLastY = iY;
			iLastW = iW;
			iLastH = iH;
			iX = 0;
			iY = 0;
			iW = sw;
			iH = sh;
		} else {
			iX = iLastX;
			iY = iLastY;
			iW = iLastW;
			iH = iLastH;
		}
		setWindowPos();
	});

	'move resize-l resize-r resize-t resize-b resize-tl resize-tr resize-br resize-bl'.split(' ').forEach(function(s){
		$rootScope.$on(s,function($targetScope,x,y){
			switch (s) {
				case 'move':	moveXY(x,y); break;
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
			setWindowPos();
		});
	});
	function setWindowPos(){
		$element.css({
			left: iX+'px'
			,top: iY+'px'
			,width: iW+'px'
			,height: iH+'px'
		});
	}
	function moveXY(x,y){
		iX = Math.min(Math.max(x,0),xMax);
		iY = Math.min(Math.max(y,0),yMax);
	}
	function resizeW(x){
		iW = Math.min(x,sw)-iX;
		setMaxX();
	}
	function resizeH(y){
		iH = Math.min(y,sh)-iY;
		setMaxY();
	}
	function resizeXW(x){
		var iOff = Math.max(x,0)-iX;
		iX += iOff;
		iW -= iOff;
		setMaxX();
	}
	function resizeYH(y){
		var iOff = Math.max(y,0)-iY;
		iY += iOff;
		iH -= iOff;
		setMaxY();
	}
	function handleWindowResize(){
		sw = Math.min(window.innerWidth,document.body.clientWidth);
		sh = Math.min(window.innerHeight,document.body.clientHeight);
		setMax();
	}
	function setMax(){
		setMaxX();
		setMaxY();
	}
	function setMaxX(){
		xMax = sw-iW;
	}
	function setMaxY(){
		yMax = sh-iH;
	}
});