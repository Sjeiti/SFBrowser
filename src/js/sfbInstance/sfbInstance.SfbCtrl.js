angular.module('sfbInstance').controller('SfbCtrl',function($scope,$rootScope,$element) {
	$scope.menuMain = 'menuMain.html';
	$scope.fileTable = 'fileTable.html';
	$scope.layout = 'list';
	$scope.x = 100;
	$scope.y = 100;
	$scope.xMax = 300;
	$scope.yMax = 300;
	$scope.w = 600;
	$scope.h = 300;
	$scope.sw = 300;
	$scope.sh = 300;

	console.log('$element',$element); // log
	$element.css({border:'1px solid red'});
	$element.css({background:'green'});

	handleWindowResize();
	window.addEventListener('resize',handleWindowResize,false);


	$scope.fullscreen = function(){
		$scope.x = 0;
		$scope.y = 0;
		$scope.w = $scope.sw;
		$scope.h = $scope.sh;
	};
	$scope.close = function(){
		$rootScope.$emit('close');
	};


	$rootScope.$on('view',function(){
		$scope.layout = $scope.layout==='grid'?'list':'grid';
	});
	$rootScope.$on('close',function(){
		$element.remove();
	});

	'move resize-l resize-r resize-t resize-b resize-tl resize-tr resize-br resize-bl'.split(' ').forEach(function(s){
		$rootScope.$on(s,function($targetScope,x,y){
			switch (s) {
				case 'move':	moveXY(x,y); break;
				case 'resize-t':		resizeYH(y); break;
				case 'resize-tr':		resizeYH(y);
				case 'resize-r':		resizeW(x); break;
				case 'resize-bl':		resizeXW(x);
				case 'resize-b':		resizeH(y); break;
				case 'resize-tl':		resizeYH(y);
				case 'resize-l':		resizeXW(x); break;
				case 'resize-br':
					resizeW(x);
					resizeH(y);
			}
			$scope.$apply();
		});
	});
	function moveXY(x,y){
		$scope.x = Math.min(Math.max(x,0),$scope.xMax);
		$scope.y = Math.min(Math.max(y,0),$scope.yMax);
	}
	function resizeW(x){
		$scope.w = Math.min(x,$scope.sw)-$scope.x;
		setMaxX();
	}
	function resizeH(y){
		$scope.h = Math.min(y,$scope.sh)-$scope.y;
		setMaxY();
	}
	function resizeXW(x){
		var iOff = Math.max(x,0)-$scope.x;
		$scope.x += iOff;
		$scope.w -= iOff;
		setMaxX();
	}
	function resizeYH(y){
		var iOff = Math.max(y,0)-$scope.y;
		$scope.y += iOff;
		$scope.h -= iOff;
		setMaxY();
	}
	function handleWindowResize(){
		$scope.sw = Math.min(window.innerWidth,document.body.clientWidth);
		$scope.sh = Math.min(window.innerHeight,document.body.clientHeight);
		setMax();
	}
	function setMax(){
		setMaxX();
		setMaxY();
	}
	function setMaxX(){
		$scope.xMax = $scope.sw-$scope.w;
	}
	function setMaxY(){
		$scope.yMax = $scope.sh-$scope.h;
	}
});