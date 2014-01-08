angular.module('sfbrowser').factory('Key',function($document){
	'use strict';
	var  aUp = []
		,aDown = []
		,aUpKey = []
		,aDownKey = []
		,aAnd = []
		,oReturn = angular.extend({
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
			,keyUp: function(keys,callback,and){
				add(keys,callback,and,true);
			}
			,keyDown: function(keys,callback,and){
				add(keys,callback,and,false);
			}
	},[]);
	$document.on('keydown',handleKey);
	$document.on('keyup',handleKey);
	function add(keys,callback,and,up){
		var sKeyType = typeof keys
			,bNumber = sKeyType==='number'
			,bObject = sKeyType==='object'
			,bFunction = sKeyType==='function'
		;
		if (bNumber||bObject) {
			var	aKeys = bObject?keys:[keys]
				,aCallbacks = up?aUpKey:aDownKey;
			if (and) {
				// todo: implement and
				aAnd.push([keys,callback]);
			} else {
				aKeys.forEach(function(key){
					if (aCallbacks[key]===undefined) aCallbacks[key] = [];
					aCallbacks[key].push(callback);
				});
			}
		} else if (bFunction) {
			(up?aUp:aDown).push(keys);
		}
	}
	function handleKey(e){
		var bUp = e.type==='keyup'
			,iKeyCode = e.keyCode
			,aKey = bUp?aUp:aDown
			,aKeys = (bUp?aUpKey:aDownKey)[iKeyCode]
			,aMap = aKeys?aKey.concat(aKeys):aKey
		;
		oReturn[iKeyCode] = true;
		aMap.map(function(fn){fn(e.keyCode,e);});
		// todo: implement and
	}
	return oReturn;
});