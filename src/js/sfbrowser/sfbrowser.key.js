angular.module('sfbrowser').factory('Key',function($document){
	var aUp = []
		,aDown = []
		,key = angular.extend({
		ESC:	27
		,F2:	113
		,HOME:	36
		,DEL:	46
		,CTRL:	17
		,SHIFT:	16
		,RETURN:	13
		,SPACE:	32
		,LEFT:	37
		,UP:	38
		,RIGHT:	39
		,DOWN:	40
		,keyUp: function(callback){
			aUp.push(callback);
		}
		,keyDown: function(callback){
			aDown.push(callback);
		}
	},[]);
	$document.on('keydown',function(e){
		key[e.keyCode] = true;
		aDown.map(function(fn){fn(e.keyCode)});
	});
	$document.on('keyup',function(e){
		key[e.keyCode] = false;
		aUp.map(function(fn){fn(e.keyCode)});
	});
	return key;
});