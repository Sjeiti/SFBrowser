/*global oSFBInjector*/
angular.module('sfbInstance').controller('SfbFileTableController',function(
		$scope
		,$rootScope
		,SfbFilesModel
		,$element
		,config
		,SfbWindowModel
	){
	'use strict';

	// local variables
	var Key = oSFBInjector.get('Key') // we do not use require because sfbrowser must remain a singleton
		,mElement = $element[0]
		,mScroll = mElement.querySelector('.scroll')
		,mMoveFiles = mElement.querySelector('.move-files')
		,aTables = mElement.querySelectorAll('table')
		,aHeadTd = aTables[0].querySelector('tr').children
		,aBodyTd
		,oFileLastClicked
	;


	// bindings

	Key.keyDown([Key.UP,Key.DOWN,Key.LEFT,Key.RIGHT,Key.SPACE,Key.RETURN],handleKeyDown);
	Key.keyUp(Key.RETURN,handleKeyUpReturn);
	Key.keyUp(Key.F2,handleKeyUpF2);
	Key.keyUp(Key.SPACE,handleKeyUpSpace);
	Key.keyUp(Key.ESC,handleKeyUpEsc);
	Key.keyUp([Key.UP,Key.DOWN,Key.LEFT,Key.RIGHT],handleKeyUpArrows);

	$rootScope.$on('heightChanged',handleHeightChanged);
	$rootScope.$on('widthChanged',handleWidthChanged);
	$rootScope.$on('move-files-start',handleMoveFilesStart);
	$rootScope.$on('move-files',handleMoveFiles);
	$rootScope.$on('move-files-end',handleMoveFilesEnd);
	$rootScope.$on('selectFiles',handleSelectFiles);
	$rootScope.$on('upload',handleUpload);

	$scope.fileKeyUp = handleFileKeyUp;
	$scope.trClick = handleTrClick;
	$scope.trDblClick = handleTrDblClick;
	$scope.trHover = handleTrHover;
	$scope.cancelUpload = SfbFilesModel.abortUpload;
	$scope.deleteFile = handleDeleteFile;
	$scope.sortBy = handleSortBy;
	$scope.iconPos = handleIconPosition;

	// set scope variables

	$scope.uploads = SfbFilesModel.uploads;
	$scope.moveFiles = [];
	$scope.currentHover = null;
	setFolder(); // sets $scope.files

	// functions

	function handleFileKeyUp(e){
		if (e.keyCode===Key.RETURN) {
			renameFile(e.target);
		}
	}

	function handleTrClick(e,file){
		var mTarget = e.target;
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
	}

	function handleTrDblClick(file){
		file.selected = true;
		finalSelect(file);
	}

	function finalSelect(file){
		if (file.type==='dir') {
			setFolder(file.name);
		} else {
			handleSelectFiles();
		}
	}

	function handleTrHover(file){
		$scope.currentHover = file;
	}

	function handleSelectFiles(){
		var aSelected = [];
		$scope.files.forEach(function(file){
			if (file.selected) {
				aSelected.push(file);
			}
		});
		config.callback(aSelected);
		$rootScope.$emit('close');
	}

	function handleDeleteFile(file){
		if (file.type==='dir') {
			console.log('todo rem dir'); // todo: rem dir
		} else {
			SfbFilesModel.deleteFile(file,function(success){
				if (success) $scope.$apply();
			});
		}
	}
	function handleSortBy(e){
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
		aTClassList.add(bDesc?'sortdesc':'sortasc');
		if (sSortBy) sortFiles(sSortBy,bDesc);
	}

	/**
	 * Calculate icon offset by extension
	 * @param file
	 * @returns {string}
	 */
	function handleIconPosition(file){
		// todo: check http://www.mailbigfile.com/101-most-popular-file-types/
		// todo: move position check to model and memoize
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

	function handleKeyDown(keyCode,e){
		e.preventDefault();
		e.stopPropagation();
	}

	function handleKeyUpReturn(){
		if ($scope.currentHover) finalSelect($scope.currentHover);
	}

	function handleKeyUpF2(){
		var oEditFile;
		$scope.files.forEach(function(file){
			if (!oEditFile&&file.selected) oEditFile = file;
		});
		if (oEditFile&&!oEditFile.nameEditing) {
			checkEnabledInputs();
			oEditFile.nameEditing = true;
			$scope.$apply();
		}
	}

	function handleKeyUpSpace(){
		// todo: shift
		if ($scope.currentHover) {
			$scope.currentHover.selected = !$scope.currentHover.selected;
			$scope.$apply();
		}
	}

	function handleKeyUpEsc(){
		$rootScope.$emit('close');
	}

	function handleKeyUpArrows(keyCode){
		hoverNextPrev([Key.DOWN,Key.RIGHT].indexOf(keyCode)!==-1);
	}

	function hoverNextPrev(next){
		var iIndex = $scope.files.indexOf($scope.currentHover)
			,iNumFiles = $scope.files.length;
		$scope.currentHover = $scope.files[iIndex!==-1?(iIndex+iNumFiles+(next?1:-1))%iNumFiles:0];
		$scope.$apply();
		// todo: scroll to if outside viewport
	}

	function handleUpload($onScope,files){
		if (files.length) {
			var	aFilesNormalize = []
				,bOverwriting = false;
			Array.prototype.forEach.apply(files,[function(file){
				aFilesNormalize.push(file.name);
			}]);
			$scope.files.forEach(function(file){
				if (aFilesNormalize.indexOf(file.name)!==-1) {
					bOverwriting = true;
				}
			});
			if (!bOverwriting||confirm('Some files will be overwritten. Proceed?')) {
				SfbFilesModel.uploadFiles(files,function(){
					setTimeout(function(){$scope.$apply();},40);
				},function(success){
					success&&sortFiles();
					$scope.$apply();
				});
				$scope.$apply();
			}
		}
	}

	function handleMoveFilesStart($targetScope,x,y,startElement){
		$scope.files.forEach(function(file){
			if (file.selected) $scope.moveFiles.push(file);
		});
		if ($scope.moveFiles.length===0) {
			var	mStartTr = findParentType(startElement,'TR');
			if (mStartTr!==null) {
				$scope.moveFiles.push(angular.element(mStartTr).controller('ngModel').$modelValue);
			}
		}
		$scope.$apply();
	}
	function handleMoveFiles($targetScope,x,y){
		mMoveFiles.style.left	= (x-SfbWindowModel.x)+'px';
		mMoveFiles.style.top	= (y-SfbWindowModel.y)+'px';
	}
	function handleMoveFilesEnd($targetScope,x,y,target){
		var mTargetTr = findParentType(target,'TR')
			,aMoveFiles = $scope.moveFiles.slice(0)
			,oTargetFile;
		if (mTargetTr!==null&&aMoveFiles.length>0) {
			oTargetFile = angular.element(mTargetTr).controller('ngModel').$modelValue;
			SfbFilesModel.moveFiles($scope.moveFiles.slice(0),oTargetFile,function(success){
				if (success) $scope.$apply();
			});
		}
		$scope.moveFiles.length = 0;
		$scope.$apply();
	}

	function checkEnabledInputs(){
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
			SfbFilesModel.renameFile(file,function(success){
				if (!success) $scope.$apply();
			});
		}
	}
	function setFolder(folder){
		SfbFilesModel.getList(folder,function(list){
			$scope.files = list;
			sortFiles();
			setTimeout(function(){
				$scope.$apply();
				aBodyTd = aTables[1].querySelector('tr').children;
				handleWidthChanged();
			},40);
		});
	}
	function sortFiles(by,bDesc){
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

	function findParentType(element,type){
		var mFound = element;
		while (mFound.parentNode&&mFound.nodeName!==type) {
			mFound = mFound.parentNode;
		}
		return mFound.nodeName===type?mFound:null;
	}

});