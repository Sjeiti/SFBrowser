/**
 * @name sfbrowser
 * @version 4.0.63
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
if (window.sfbrowser===undefined) window.sfbrowser = (function () {
	var sUriCDN = '//ajax.googleapis.com/ajax/libs/angularjs/1.2.5/'
		,sUriAngularBaseCDN = sUriCDN+'angular.js'
		,sUriAngularResourceCDN = sUriCDN+'angular-resource.js'
		,sUriAngularBase = 'js/vendor/angular.js'
		,sUriAngularResource = 'js/vendor/angular-resource.min.js'
		,sUriCSS = 'css/sfbrowser.css'
		,sUriTemplates = 'sfbrowser.html'
//		,sUriAPI = 'json/dir.json'
		,sUriAPI = 'connector/php'
		//
		,oSFBInjector
		// document.createElement('div')//
		,iCntInstance = 0
	;
	// try to load from CDN or fallback to local files (and one by one or sometimes error)
	window.angular&&initCSS()
	||loadScripts([sUriAngularBaseCDN,sUriAngularResourceCDN],true)
		.then(initCSS,function (){
			loadScripts([sUriAngularBase,sUriAngularResource],true).then(initCSS);
		});
	// and proceed...
	function initCSS(){
		loadScripts(sUriCSS).then(initModule);
	}
	function initModule(){
		console.log('initModule'); // log
		angular.module('sfbrowser',['ngResource'])
			.config(function($provide, $compileProvider, $filterProvider) {
			})
			.run(function($http,$injector){
				$http.get(sUriTemplates).success(function(response){
          			$injector.get('$compile')(response);
				});
			})
			.factory('key',function($document) {
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
			})
			.factory('SfbApi',function($resource) {
				return $resource(
					sUriAPI+'/list/:base:folder'
					,{}
					,{
						list: {
							method: 'POST'
							, params:{
								base:encodeURIComponent('../../data/')
								,folder:'@folder'
							}
							, isArray: false
						}
					}
				);
			})
//			services.factory('Api',['$resource',function ($resource) {
//				return {
//					Recipe: $resource('/recipes/:id',{id: '@id'}),
//					Users: $resource('/users/:id',{id: '@id'}),
//					Group: $resource('/groups/:id',{id: '@id'})
//				};
//			}]);
			.factory('createSfbElement',function($templateCache) {
				return function(){
					var mElement = angular.element($templateCache.get('sfbrowser.html'))[0]
					document.body.appendChild(mElement);
					return mElement;
				};
			})
		;
		var mSFB
			,oSFB = {}; // todo: hoist
		angular.bootstrap(oSFB, ['sfbrowser']);
		mSFB = angular.element(oSFB);
		oSFBInjector = mSFB.injector();
		////////////////////////////////////////////////////////
		setTimeout(init,1000);
	}

	/**
	 * Initialise
	 */
	function init(options) {
		angular.module('sfbInstance',[])
			.constant('SfbApi',oSFBInjector.get('SfbApi'))
			.constant('$templateCache',oSFBInjector.get('$templateCache'))
			.constant('key',oSFBInjector.get('key'))
			.config(function($provide) {
				angular.forEach(angular.extend({
					directory:''
					,callback: function(files){console.log(files)}
				},options),function(value,key) {
					$provide.value(key,value);
				});
			})
			.controller('sfbWindowController',function($scope,$rootScope,$element) {
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
			})
			.directive('draggable', function($rootScope) {
				function link(scope, element, attrs) {
					var mElement = element[0]
						,iOffsetX
						,iOffsetY
						,sEmit = attrs.draggable
						,mBody = document.body
						,oBodyClass = mBody.classList
					;
					mElement.addEventListener('mousedown',handleElementMouseDown,false);
					function handleElementMouseDown(e){
						iOffsetX = e.offsetX-mBody.scrollLeft;
						iOffsetY = e.offsetY-mBody.scrollTop;
						document.addEventListener('mousemove',handleDocumentMouseMove,false);
						document.addEventListener('mouseup',handleDocumentMouseUp,false);
//						oBodyClass.add('userSelectNone');
					}
					function handleDocumentMouseUp(){
						document.removeEventListener('mousemove',handleDocumentMouseMove);
						document.removeEventListener('mousemove',handleDocumentMouseUp);
//						oBodyClass.remove('userSelectNone');
					}
					function handleDocumentMouseMove(e){
//						element.css({border:'1px solid red'});
//						angular.element(scope).css({border:'1px solid red'});
//						console.log('$rootScope',$rootScope); // log
						$rootScope.$emit(sEmit,e.pageX-iOffsetX,e.pageY-iOffsetY);
					}
				}
				return { link: link };
			})
			.controller('sfbMenuController',function($scope,$rootScope) {
				$scope.filesView = function(){
					$rootScope.$emit('view');
				};
			})
			.controller('sfbFileTableController',function($scope,$rootScope,SfbApi,$element,callback,key) {

				var sCurrentFolder = '';
				var oFileLastClicked;

				setFolder();

				key.keyUp(function(keyCode){
					if (keyCode===key.RETURN) {
						// todo: select file/folder and possibly close
					} else if (keyCode===key.SPACE) {
						// todo: highlight file/folder
					} else if (keyCode===key.ESC) {
						console.log('escape pressed'); // log
						$rootScope.$emit('close');
					} else {

					}
				});

				$rootScope.$on('move-files',function ($targetScope,x,y) {
					console.log('move-files',$targetScope,x,y); // log
				});

				$scope.handleFileKeyUp = function(e){
					if (e.keyCode===key.RETURN) {
						renameFile(mInput);
					}
				};
				$scope.handleTrClick = function(e,file){
					var mTarget = e.target;
					checkEnabledInputs();
					if (!key[key.CTRL]) clearSelected();
					if (key[key.SHIFT]&&oFileLastClicked) {
						console.log('shift'); // log
						var iIndexCur = $scope.files.indexOf(file)
							,iIndexLast = $scope.files.indexOf(oFileLastClicked)
							,iMin = iIndexCur<iIndexLast?iIndexCur:iIndexLast
							,iMax = iIndexCur>iIndexLast?iIndexCur:iIndexLast
						;
						for (var i=iMin;i<=iMax;i++) {
							$scope.files[i].selected = true;
						}
					} else if (file.selected&&mTarget.nodeName==='INPUT') {
						if (mTarget.getAttribute('disabled')!==null) {
							mTarget.removeAttribute('disabled');
						}
					} else {
						file.selected = !file.selected;
						if (!file.selected) oFileLastClicked = null;
					}
					oFileLastClicked = file;
				};
				$scope.handleTrDblClick = function(file){
					file.selected = true;
					if (file.type==='dir') {
						setFolder(file.name);
					} else {
						var aSelected = [];
						$scope.files.forEach(function(file){
							if (file.selected) {
								aSelected.push(file);
							}
						});
						callback(aSelected);
					}
				};
				$scope.fileDimensions = function(file){
					return file.width&&file.height?(file.width+' x '+file.height):'';
				};
				$scope.formatSize = function(file){
					return formatSize(file.size);
				};
				$scope.theadSize = function(e){
					console.log('theadSize'); // log
					var el = e.currentTarget
						,$el = angular.element(el);
					$el.css({width:'50px'});
					//
					$scope.files.sort(function(a,b){
						return a.name>b.name?1:0;
					});
				};
				/**
				 * Calculate icon offset
				 * @param file
				 * @returns {string}
				 */
				$scope.icon = function(file){ // todo: check http://www.mailbigfile.com/101-most-popular-file-types/
					var iHo = file.ext.charCodeAt(0)-97;
					var iVo = file.ext.charCodeAt(1)-97;
					switch (file.type) {
						case 'dir':		iHo = 26;	iVo = 2; break;
						case 'folderup':	iHo = 28;	iVo = 2; break;
					}
					switch (file.ext) {
						case 'odg':	iHo = 26; break;
						case 'ods':	iHo = 27; break;
						case 'odp':	iHo = 28; break;
					}
					iHo *= -16;
					iVo *= -16;
					// file td
					return 'background-position:'+iHo+'px '+iVo+'px;';
				};
				/**
				 * Formats a number to the appropriate filesize notation
				 * @name iddqd.internal.native.number.formatSize
				 * @method
				 * @param {number} int The number to round
				 * @param {number} round The number of decimals to round by
				 * @returns {string} Filesize string result
				 */
				function formatSize(int,round) {
					var i, size = int;
					if (round===undefined) round = 0;
					var aSizes = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
					for (i = 0; size>1024 && (aSizes.length>=(i + 2)); i++) size /= 1024;
					var iMult = Math.pow(10,round);
					return (Math.round(size * iMult) / iMult) + aSizes[i];
				}
				function checkEnabledInputs(){
					var aInputs = $element[0].querySelectorAll('tbody input');
					for (var i=0,l=aInputs.length;i<l;i++){
						renameFile(aInputs[i]);
					}
				}
				function clearSelected(){
					var aFiles = $scope.files;
					for (var i=0,l=aFiles.length;i<l;i++){
						aFiles[i].selected = false;
					}
				}
				function renameFile(inputElement){
					if (inputElement.getAttribute('disabled')===null) {
						inputElement.setAttribute('disabled','disabled');
						// todo: server call
					}
				}
				function setFolder(folder){
					var sNewFolder = sCurrentFolder+'/'+(folder||'');
					SfbApi.list({folder:encodeURIComponent(sNewFolder)}).$promise.then(function(result){
						if (result.success) {
							sCurrentFolder = sNewFolder;
							$scope.files = result.data;
							$scope.$apply();
						} else {
							// todo: handle error
						}
					});
				}
			})
		;
        angular.bootstrap(oSFBInjector.get('createSfbElement')(), ['sfbInstance']);
	}

	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	/*var nextFrame = (function(){
			return window.requestAnimationFrame||
				window.webkitRequestAnimationFrame||
				window.mozRequestAnimationFrame||
				window.oRequestAnimationFrame||
				window.msRequestAnimationFrame||
				function(callback){
					window.setTimeout(callback, 1000/60);
				};
		})()
	;*/

	/**
	 * Load javascript file
	 * @method
	 * @param {Array|String} srcList The source location of the file.
	 * @param {Boolean} sequential Load sequential or simultaneaously.
	 * @return {Object} promise
	 */
	function loadScripts(srcList,sequential) {
		if (!Array.isArray(srcList)) srcList = [srcList];
		var iNumToLoad = srcList.length
			,aFullfilled = []
			,aUnfullfilled = []
			,aProgress = []
		;
		if (sequential) {
			loadScript(srcList.shift());
		} else {
			srcList.forEach(loadScript);
		}
		function loadScript(src){
			var sExtension = src.split('.').pop()
				,sElementType = {js:'script',css:'link'}[sExtension]
				,sAttribute = {js:'src',css:'href'}[sExtension]
				,mElement = document.createElement(sElementType);
			mElement.setAttribute(sAttribute,src);
			if (sExtension==='css') {
				mElement.setAttribute('type','text/css');
				mElement.setAttribute('media','screen');
				mElement.setAttribute('rel','stylesheet');
			}
			mElement.addEventListener('load',handleSrcLoaded);
			mElement.addEventListener('error',handleSrcError);
			(document.head || document.getElementsByTagName('head')[0]).appendChild(mElement);
		}
		function handleSrcLoaded(){
			iNumToLoad--;
			if (iNumToLoad===0) {
				aFullfilled.forEach(function(fn){
					fn.call();
				});
			} else if (sequential) {
				loadScript(srcList.shift());
			}
		}
		function handleSrcError(){
			aUnfullfilled.forEach(function(fn){
				fn.call();
			});
		}
		return {
			then: function(fullfilled,unfullfilled,progress){
				aFullfilled.push(fullfilled);
				aUnfullfilled.push(unfullfilled);
				aProgress.push(progress);
			}
		};
	}
	//
	return {
		init: init
	};
})();