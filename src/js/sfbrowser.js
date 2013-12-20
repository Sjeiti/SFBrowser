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
		,sUriAPI = 'json/dir.json'
		//
		,mSFB = document.createElement('div')//{}//
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
		angular.module('sfbrowser',['ngResource'])
//				.config(function($provide, $compileProvider, $filterProvider) {
//					$provide.value('templates', '');
//					$provide.factory('getTemplates', function($rootScope) { return $rootScope.templates; });
//					$provide.factory('hi', function() { console.log('hello'); });
//					$compileProvider.directive('directiveName', ...);
//					$filterProvider.register('filterName', ...);
//				})
//				.value('foobar',1234)
//				.factory('foar',function($http,$injector,$rootScope){
//					console.log('foobar',$http,$injector,$rootScope); // log
//					return '12341234'
//				})
			.run(function($http,$injector,$rootScope){
				$http.get(sUriTemplates).success(function(response){
					//$injector.get('$compile')(response);
					$rootScope.templates = response;
					var rxScriptG = /<script\b[^>]*>([\s\S]*?)<\/script>/g
						,rxScript = /<script\b[^>]*>([\s\S]*?)<\/script>/
						,aScripts = response.match(rxScriptG)
						,oTpl = {};
					aScripts&&aScripts.forEach(function(s){
						oTpl[s.match(/id=\"([^"]*)/)[1]] = s.match(rxScript)[1];
					});
					$rootScope.sfbrowserhtml = oTpl['sfbrowser.html'];
				});
			})
			.factory('SfbList',function ($resource) {
				return $resource(sUriAPI,{},{
					query: {method: 'GET', params:{}, isArray: true}
				});
			})
		;
		angular.bootstrap(mSFB, ['sfbrowser']);
		//
		////////////////////////////////////////////////////////
		//
		var sfbscope = angular.element(mSFB).scope();
//		console.log('ext',angular.module('sfbrowser').controller('Foo')); // log
//		console.log('ext',sfbscope,sfbscope.getHTML()); // log
		setTimeout(function (){
//			console.log('ext',sfbscope,sfbscope.getHTML()); // log
			console.log('ext',angular.element(mSFB).scope().templates); // log
		},1000);
		setTimeout(init,1000);
	}

	/**
	 * Initialise
	 */
	function init(options) {
		options = angular.extend({
			directory:''
		},options);
		//
		var sfbScope = angular.element(mSFB).scope()
			,sName = 'sfb-inst-'+(iCntInstance++)
			,mInst = angular.element(sfbScope.sfbrowserhtml)[0];
		angular.module(sName,['sfbrowser'])
//			.config(function($provide, $compileProvider, $filterProvider) {
//				$provide.value('layout', 'list');
//			})
//			.config(['$provide', function($provide){
//				$provide.decorator('$rootScope', ['$delegate', function($delegate){
//					Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
//						value: function(name, listener){
//							var unsubscribe = $delegate.$on(name, listener);
//							this.$on('$destroy', unsubscribe);
//						},
//						enumerable: false
//					});
//					return $delegate;
//				}]);
//			}])
			.run(function($injector){
//				console.log('$element',$element); // log
          		$injector.get('$compile')(angular.element(mSFB).scope().templates);
			})
//			.factory('mySharedService', function($rootScope) {
//				var sharedService = {};
//				sharedService.message = '';
//				sharedService.prepForBroadcast = function (msg) {
//					this.message = msg;
//					this.broadcastItem();
//				};
//				sharedService.broadcastItem = function () {
//					$rootScope.$broadcast('handleBroadcast');
//				};
//				return sharedService;
//			})
			.controller('sfbWindowController',function($scope,$rootScope,$element) {
				$scope.menuMain = 'menuMain.html';
				$scope.fileTable = 'fileTable.html';
				$scope.layout = 'list';
				$scope.x = 100;
				$scope.y = 100;
				$scope.xMax = 300;
				$scope.yMax = 300;
				$scope.w = 300;
				$scope.h = 300;
				$scope.sw = 300;
				$scope.sh = 300;

				handleWindowResize();
				window.addEventListener('resize',handleWindowResize,false);
//				$scope.$on('view', function(){
//					console.log('foo',arguments);
//				});
//				$scope.$onRootScope('view', function(){
//					console.log('foo');
//				});
//				$rootscope.$on('view',function(){
//					console.log('view',arguments); // log
//				});
				$rootScope.$on('view',function(){
					$scope.layout = $scope.layout==='grid'?'list':'grid';
				});

//				// move
//				$rootScope.$on('move',function($targetScope,x,y){
//					moveX(x);
//					moveY(y);
//					$scope.$apply();
//				});
//				// resize
//				$rootScope.$on('resize-l',function($targetScope,x){
//					resizeXW(x);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-r',function($targetScope,x){
//					resizeW(x);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-t',function($targetScope,x,y){
//					resizeYH(y);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-b',function($targetScope,x,y){
//					resizeH(y);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-tl',function($targetScope,x,y){
//					resizeXW(x);
//					resizeYH(y);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-tr',function($targetScope,x,y){
//					resizeW(x);
//					resizeYH(y);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-br',function($targetScope,x,y){
//					resizeW(x);
//					resizeH(y);
//					$scope.$apply();
//				});
//				$rootScope.$on('resize-bl',function($targetScope,x,y){
//					resizeXW(x);
//					resizeH(y);
//					$scope.$apply();
//				});
				'move resize-l resize-r resize-t resize-b resize-tl resize-tr resize-br resize-bl'.split(' ').forEach(function(s){
					$rootScope.$on(s,function($targetScope,x,y){
						var sName = $targetScope.name.split('-').pop();
						switch (sName) {
							case 'move':	moveXY(x,y); break;
							case 't':		resizeYH(y); break;
							case 'tr':		resizeYH(y);
							case 'r':		resizeW(x); break;
							case 'bl':		resizeXW(x);
							case 'b':		resizeH(y); break;
							case 'tl':		resizeYH(y);
							case 'l':		resizeXW(x); break;
							case 'br':
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

				$scope.fullscreen = function(){
					$scope.x = 0;
					$scope.y = 0;
					$scope.w = $scope.sw;
					$scope.h = $scope.sh;
				};
				$scope.close = function(){
					document.body.removeChild(mInst);
				};
			})
			.directive('draggable', function($rootScope) {
				function link(scope, element, attrs) {
					var mElement = element[0]
						,iOffsetX
						,iOffsetY
						,sEmit = attrs.draggable
						,oBodyClass = document.body.classList
					;
					mElement.addEventListener('mousedown',handleElementMouseDown,false);
					function handleElementMouseDown(e){
						iOffsetX = e.offsetX;
						iOffsetY = e.offsetY;
						document.addEventListener('mousemove',handleDocumentMouseMove,false);
						document.addEventListener('mouseup',handleDocumentMouseUp,false);
						oBodyClass.add('userSelectNone');
					}
					function handleDocumentMouseMove(e){
						$rootScope.$emit(sEmit,e.pageX-iOffsetX,e.pageY-iOffsetY);
					}
					function handleDocumentMouseUp(){
						document.removeEventListener('mousemove',handleDocumentMouseMove);
						document.removeEventListener('mousemove',handleDocumentMouseUp);
						oBodyClass.remove('userSelectNone');
					}
				}

				return {
					link: link
					,restrict: 'A'
				}
			})
			.controller('sfbMenuController',function($scope,$rootScope) {
				$scope.filesView = function(){
					$rootScope.$emit('view');
				};
			})
			.controller('sfbFileTableController',function($scope,SfbList,$element) {
				$scope.files = SfbList.query();

				$scope.select = function(file){
					file.selected = !file.selected;
				};
				$scope.choose = function(file){
					file.selected = true;
					var aSelected = [];
					$scope.files.forEach(function(file){
						if (file.selected) {
							aSelected.push(file);
						}
					});
					console.log('choose'
						,aSelected
					);
				};
			})
		;
        angular.bootstrap(mInst, [sName]);
		document.body.appendChild(mInst);
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
	function randomFiles(){
		var lorem = rndFrom('lorem,ipsum,dolor,sit,amet,consectetur,adipiscing,elit,ut,aliquam,purus,amet,luctus,venenatis,lectus,magna,fringilla,urna,porttitor,rhoncus,non,enim,praesent,elementum,facilisis,leo,vel,est,ullamcorper,eget,nulla,facilisi,etiam,dignissim,diam,quis,lobortis,scelerisque,fermentum,dui,faucibus,in,ornare,quam,viverra,orci,sagittis,eu,volutpat,odio,mauris,massa,vitae,tortor,condimentum,lacinia,eros,donec,ac,tempor,dapibus,ultrices,iaculis,nunc,sed,augue,lacus,congue,eu,consequat,felis,et,pellentesque,commodo,egestas,phasellus,eleifend,pretium,vulputate,sapien,nec,aliquam,malesuada,bibendum,arcu,curabitur,velit,sodales,sem,integer,justo,vestibulum,risus,ultricies,tristique,aliquet,tortor,at,auctor,urna,id,cursus,metus,mi,posuere,sollicitudin,orci,a,semper,duis,tellus,mattis,nibh,proin,nisl,venenatis,a,habitant,morbi,senectus,netus,fames,turpis,tempus,pharetra,pharetra,mi,hendrerit,gravida,blandit,hac,habitasse,platea,dictumst,quisque,sagittis,consequat,nisi,suscipit,maecenas,cras,aenean,placerat,vestibulum,eros,tincidunt,erat,imperdiet,euismod,nisi,porta,mollis,leo,nisl,ipsum,nec,nullam,feugiat,fusce,suspendisse,potenti,vivamus,dictum,varius,sapien,molestie,ac,massa,accumsan,vitae,arcu,vel,dolor,enim,neque,convallis,neque,tempus,nam,pulvinar,laoreet,interdum,libero,est,tempor,elementum,nunc,risus,cum,sociis,natoque,penatibus,magnis,dis,parturient,montes,nascetur,ridiculus,mus,accumsan,lacus,volutpat,dui,ligula,libero,justo,diam,rhoncus,felis,et,mauris,ante,metus,commodo,velit,non,tellus,purus,rutrum,fermentum,pretium,elit,vehicula'.split(','))
			,type = rndFrom('jpg,jpeg,png,gif,txt,as,md,js,html,xml,'.split(','))
			,aFiles = []
		;
		for (var i=0;i<23;i++) {
			var sType = type()
				,sName = lorem()
				,sFile = sName+'.'+sType
				,iTime = Math.random()*1.4E12<<0
			;
			aFiles.push({
				 name: sFile
				,path: 'data/'+sFile
				,type: sType
				,size: Math.random()*1E4<<0
				,time: iTime
				,date: new Date(iTime)
			});
		}
		function rndFrom(a){
			var i = a.length;
			return function(){
				return a[Math.random()*i<<0]
			}
		}
		return aFiles;
	}

	//
	//
	return {
		init: init
	};
})();