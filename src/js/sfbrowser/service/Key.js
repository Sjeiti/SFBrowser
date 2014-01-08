angular.module('sfbrowser').factory('Key',function($document){
	'use strict';
	var //generic bindings
		 aUp = []
		,aDn = []
		// specific key bindings
		,aUpKey = []
		,aDnKey = []
		// key combination bindings
		,aUpAnd = []
		,aDnAnd = []
		// servic object
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
		},[])
		,iNumPressed = 0
	;
	$document.on('keydown',handleKey);
	$document.on('keyup',handleKey);
	function add(keys,callback,and,up){
		if (keys.length===1&&and) and = false;
		var sKeyType = typeof keys
			,bNumber = sKeyType==='number'
			,bObject = sKeyType==='object'
			,bFunction = sKeyType==='function'
		;
		if (bNumber||bObject) {
			var	aKeys = bObject?keys:[keys]
				,aCallbacks = up?aUpKey:aDnKey
				,aAnd = up?aUpAnd:aDnAnd;
			if (and) {
				aAnd.push({
					keys:keys.reverse().map(function(key){
							return typeof key==='number'?key:key.toUpperCase().charCodeAt(0);
						})
					,callback:callback
				});
			} else {
				aKeys.forEach(function(key){
					if (aCallbacks[key]===undefined) aCallbacks[key] = [];
					aCallbacks[key].push(callback);
				});
			}
		} else if (bFunction) {
			(up?aUp:aDn).push(keys);
		}
	}
	function handleKey(e){
		var bUp = e.type==='keyup'
			,bDn = e.type==='keydown'
			,iKeyCode = e.keyCode
			,aKey = bUp?aUp:aDn
			,aAnd = bUp?aUpAnd:aDnAnd
			,aKeys = (bUp?aUpKey:aDnKey)[iKeyCode]
			,aMap = aKeys?aKey.concat(aKeys):aKey
			,iShouldPress = iNumPressed + (bUp?0:1)
		;
		if (oReturn[iKeyCode]!==bDn) iNumPressed += bUp?-1:1;
		oReturn[iKeyCode] = !bUp;
		aMap.map(function(fn){fn(e.keyCode,e);});
		if (iShouldPress>1) {
			aAnd.forEach(function(and){
				var aKeys = and.keys;
				if (aKeys.length===iShouldPress&&iKeyCode===aKeys[0]) {
					var bAnd = true;
					aKeys.forEach(function(key,i){
						if (i>0&&bAnd&&!oReturn[key]) {
							bAnd = false;
						}
					});
					if (bAnd) and.callback(e.keyCode,e);
				}
			});
		}
	}
	return oReturn;
});