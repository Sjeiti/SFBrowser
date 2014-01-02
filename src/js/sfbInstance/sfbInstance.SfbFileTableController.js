angular.module('sfbInstance').controller('sfbFileTableController',function($scope,$rootScope,Api,$element,callback,Key) {
	'use strict';
	var mElement = $element[0]
		,mScroll = mElement.querySelector('.scroll')
		,aTables = mElement.querySelectorAll('table')
		,aHeadTd = aTables[0].querySelector('tr').children
		,aBodyTd
		,sCurrentFolder = ''
		,oFileLastClicked
		,sBaseFolder = 'data/'
	;

	setFolder();

	$rootScope.$on('heightChanged',handleHeightChanged);
	$rootScope.$on('widthChanged',handleWidthChanged);
	$rootScope.$on('move-files',handleMoveFiles);
	$rootScope.$on('selectFiles',selectFiles);
	Key.keyUp(handleKeyUp);

	$scope.handleFileKeyUp = function(e){
		if (e.keyCode===Key.RETURN) {
			renameFile(e.target);
		}
	};
	$scope.handleTrClick = function(e,file){
		var mCurrentTarget = e.currentTarget
			,mTarget = e.target;
		console.log('handleTrClick',file.selected,mTarget.nodeName,mCurrentTarget.nodeName); // log
		checkEnabledInputs();
		if (!Key[Key.CTRL]) clearSelected(file);
		if (Key[Key.SHIFT]&&oFileLastClicked) {
			var iIndexCur = $scope.files.indexOf(file)
				,iIndexLast = $scope.files.indexOf(oFileLastClicked)
				,iMin = iIndexCur<iIndexLast?iIndexCur:iIndexLast
				,iMax = iIndexCur>iIndexLast?iIndexCur:iIndexLast
			;
			for (var i=iMin;i<=iMax;i++) {
				$scope.files[i].selected = true;
			}
		} else if (file.selected&&file.name!=='..'&&mTarget.nodeName==='INPUT') {
			if (!file.nameEditing) {
				file.nameEditing = true;
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
			selectFiles();
//			var aSelected = [];
//			$scope.files.forEach(function(file){
//				if (file.selected) {
//					aSelected.push(file);
//				}
//			});
//			callback(aSelected);
		}
	};
	function selectFiles(){
		var aSelected = [];
		$scope.files.forEach(function(file){
			if (file.selected) {
				aSelected.push(file);
			}
		});
		callback(aSelected);
		$rootScope.$emit('close');
	}
	/*$scope.getDownloadLink = function(file){
		var mA = document.createElement('a');
		mA.innerText = 'download';
		mA.href = sCurrentFolder+file.name;
		mA.download = file.name;
		return mA;
	};*/
	$scope.deleteFile = function(file){
		if (file.type==='dir') {
			console.log('todo rem dir'); // todo: rem dir
		} else {
			Api.delete({file:encodeURIComponent(sCurrentFolder+'/'+file.name)},function(result) {
				if (result.success) {
					var iIndex = $scope.files.indexOf(file);
					if (iIndex!==-1) {
						$scope.files.splice(iIndex,1);
						$scope.$apply();
					}
				} else {
					console.log('result.error',result.error);
				}
			});
		}
	};
	$scope.sortBy = function(e){
		var mCTarget = e.currentTarget
			,aTh = mCTarget.childNodes
			,mTarget = e.target
			,aTClassList = mTarget.classList
			,bDesc = aTClassList.contains('sortasc')
			,sSortBy = mTarget.getAttribute('data-type')
		;
		for (var i=0,l=aTh.length;i<l;i++) {
			var mSibl = aTh[i];
			mSibl.classList.remove('sortasc');
			mSibl.classList.remove('sortdesc');
		}
		//console.log('mTarget.siblings',mTarget.siblings); // log
		aTClassList.add(bDesc?'sortdesc':'sortasc');
		if (sSortBy) sortFiles(sSortBy,bDesc);
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
//		var aInputs = mElement.querySelectorAll('tbody input');
//		for (var i=0,l=aInputs.length;i<l;i++){
//			renameFile(aInputs[i]);
//		}
		$scope.files.forEach(function(file){
			renameFile(file);
		});
	}
	function clearSelected(except){
		var aFiles = $scope.files;
		for (var i=0,l=aFiles.length;i<l;i++){
			var file = aFiles[i];
			if (file!==except) file.selected = false;
		}
	}
	function renameFile(file){
		if (file.nameEditing) {
			file.nameEditing = false;
			if (file.name!==file.originalName) {
				Api.rename({
					file:encodeURIComponent(sCurrentFolder+'/'+file.originalName)
					,to:encodeURIComponent(sCurrentFolder+'/'+file.name)
				},function(result) {
					if (result.success) {
						file.originalName = file.name;
					} else {
						file.name = file.originalName;
						$scope.$apply();
						console.log('result.error',result.error); // todo: handle error
					}
				});
			}
		}
	}
	function setFolder(folder){
					console.log('setFolder',folder); // log
		var sNewFolder = sCurrentFolder+'/'+(folder||'');
		Api.list({folder:encodeURIComponent(sNewFolder)},function(result) {
			if (result.success) {
				sCurrentFolder = sNewFolder;
				result.data.forEach(function(file){
					var bWH = file.width&&file.height;
					file.originalName = file.name;
					file.path = sBaseFolder+sCurrentFolder;
					file.surface = bWH?file.width*file.height:'';
					file.dimensions = bWH?(file.width+' x '+file.height):'';
					file.sizeFormatted = file.type!=='dir'?formatSize(file.size):'';
					file.nameEditing = false;

				});
				$scope.files = result.data;
				sortFiles();
				$scope.$apply();
				aBodyTd = aTables[1].querySelector('tr').children;
				handleWidthChanged();
			} else {
				console.log('result.error',result.error); // todo: handle error
			}
		});
	}
	function sortFiles(by,bDesc){
		console.log('sortFiles',by); // log
		if (by===undefined) by = 'name';
		var iAscDesc = bDesc?-1:1;
		$scope.files.sort(function(a,b){
			if ((a.type==='dir'&&b.type!=='dir')||a.name==='..') {
				return -1;
			} if ((a.type!=='dir'&&b.type==='dir')||b.name==='..') {
				return 1;
			} else {
				var sA = a[by]
					,sB = b[by];
				if (sA===undefined) return 1;
				else if (sB===undefined) return -1;
				if (sA&&sA.toLowerCase) sA = sA.toLowerCase();
				if (sB&&sB.toLowerCase) sB = sB.toLowerCase();
				if (sA>sB) return iAscDesc;
				if (sA<sB) return -iAscDesc;
				return 0;
			}
		});
	}

	function handleWidthChanged(){
		if (aBodyTd) {
			for (var i=0,l=aBodyTd.length-1;i<l;i++) {
				aHeadTd[i].style.width = aBodyTd[i].offsetWidth+'px';
			}
		}
	}
	function handleHeightChanged($targetScope,h){
		mScroll.style.height = (h-85)+'px';
	}
	function handleMoveFiles($targetScope,x,y){
		console.log('move-files',$targetScope,x,y); // log
	}
	function handleKeyUp(keyCode){
		if (keyCode===Key.RETURN) {
			// todo: select file/folder and possibly close
		} else if (keyCode===Key.SPACE) {
			// todo: highlight file/folder
		} else if (keyCode===Key.ESC) {
			console.log('escape pressed'); // log
			$rootScope.$emit('close');
		} else {

		}
	}
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	$scope.uploads = [];
	$rootScope.$on('upload',function($onScope,files){
		console.log('upload',arguments); // log
		for (var i=0,l=files.length;i<l;i++) {
			$scope.uploads.push(files[i]);
		}
		console.log('$scope.uploads',$scope.uploads); // log
		$scope.$apply();
		uploadFile();
	});
    function uploadFile() {
        var oFormData = new FormData(), i = 0;
        oFormData.append('folder',sCurrentFolder);
		$scope.uploads.forEach(function(file){
            oFormData.append('file'+(i++),file);
		});
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "connector/php/upload");
        xhr.send(oFormData);
		/*Api.upload({
			folder:encodeURIComponent('folder')//sCurrentFolder
			,formData:oFormData
		},function(result) {
			console.log('api',result); // log
		});*/
    }
	function uploadProgress(e){
        console.log('uploadProgress',Math.round(e.loaded * 100 / e.total)); // log
	}
	function uploadComplete(e){
		var oResponse = JSON.parse(e.currentTarget.response);
		console.log('uploadComplete',oResponse); // log
		if (oResponse.success) {
			oResponse.data.forEach(function(file){
				$scope.uploads.forEach(function(upfile,i){
					if (file.name===upfile.name) {
						$scope.uploads.splice(i,1);
						$scope.files.push(file);
					}
				});
			});
			sortFiles();
			$scope.$apply();
		}
	}
	function uploadFailed(e){console.log('uploadFailed',e);}
	function uploadCanceled(e){console.log('uploadCanceled',e);}
});
//angular.module('sfbInstance').directive('ng-file', function() {
//	'use strict';
//	function link(scope, element, attrs) {
//	}
//	return { link: link };
//});