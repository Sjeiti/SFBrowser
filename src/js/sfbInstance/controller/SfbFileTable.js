/*global oSFBInjector*/
angular.module('sfbInstance').controller('SfbFileTable',function(
		$scope
		,$rootScope
		,$element
		,SfbConfig
		,SfbFilesModel
		,SfbWindowModel
	){
	'use strict';

	// todo: implement file duplication

	// local variables

	var Key = oSFBInjector.get('Key') // we do not use require because sfbrowser must remain a singleton
		,mElement = $element[0]
		,mFile = mElement.querySelector('#fileUpload')
		,mScroll = mElement.querySelector('.scroll')
		,mMoveFiles = mElement.querySelector('.move-files')
		,aTables = mElement.querySelectorAll('table')
		,aHeadTd = aTables[0].querySelector('tr').children
		,aBodyTd
		,oFileLastClicked
		,iClickTimeoutID
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
	$rootScope.$on('uploadDrop',handleUploadDrop);
	$rootScope.$on('upload',handleUpload);
	$rootScope.$on('newFolder',handleNewFolder);

	$scope.trClick = handleTrClick;
	$scope.trDblClick = handleTrDblClick;
	$scope.trHover = handleTrHover;
	$scope.cancelUpload = SfbFilesModel.abortUpload;
	$scope.deleteFile = handleDeleteFile;
	$scope.sortBy = handleSortBy;

	// event

	mFile.addEventListener('change',handleFileChange,true);

	// set scope variables

	$scope.uploads = SfbFilesModel.uploads;
	$scope.moveFiles = [];
	$scope.currentHover = null;
	openFolder(); // sets $scope.files

	// functions

	function handleTrClick(e,file){
		iClickTimeoutID = setTimeout(function(){
			var mTarget = e.target;
			if (!(file.nameEditing&&mTarget.nodeName==='INPUT')) {
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
					if (!file.nameEditing) file.nameEditing = true;
				} else {
					file.selected = !file.selected;
					if (!file.selected) oFileLastClicked = null;
				}
				oFileLastClicked = file;
				$scope.$apply();
			}
		},200);
	}

	function handleTrDblClick(file){
		clearTimeout(iClickTimeoutID);
		file.selected = true;
		finalSelect(file);
	}

	function finalSelect(file){
		if (file.type==='dir') {
			if (!file.nameEditing) openFolder(file.name);
			else renameFile(file);
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
		SfbConfig.callback(aSelected);
		$rootScope.$emit('close');
	}

	function handleDeleteFile(file){
		// todo: don't delete non-empty folders
		SfbFilesModel.deleteFile(file,function(success){
			if (success) $scope.$apply();
		});
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
		var oFileEdit = $scope.currentHover;
		$scope.files.forEach(function(file){
			if (file.nameEditing) oFileEdit = file;
		});
		if (oFileEdit) finalSelect(oFileEdit);
	}

	function handleKeyUpF2(){
		var oEditFile;
		$scope.files.forEach(function(file){
			if (!oEditFile&&file.selected) oEditFile = file;
		});
		if (oEditFile&&!oEditFile.nameEditing) {
			editFileName(oEditFile);
		}
	}

	function editFileName(file){
		checkEnabledInputs();
		file.nameEditing = true;
		$scope.$apply();
		console.log('editFileName',file); // log
	}

	function handleKeyUpSpace(){
		// todo: shift
		if ($scope.currentHover) {
			$scope.currentHover.selected = !$scope.currentHover.selected;
			$scope.$apply();
		}
	}

	function handleKeyUpEsc(){
		// todo: not close when editing name
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

	function handleUploadDrop(){
		upload(mFile.files);
	}

	function handleUpload(){
		var oEvent = document.createEvent("MouseEvents");
		oEvent.initMouseEvent("click",true,true,window,1,0,0,0,0,false,false,false,false,0,null);
		mFile.dispatchEvent(oEvent);
	}

	function handleFileChange(){
		upload(mFile.files);
	}

	function upload(files){
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

	function handleNewFolder(){
		SfbFilesModel.newFolder(function(success,folder){
			if (success) {
				sortFiles();
				editFileName(folder);
			}
		});
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
			SfbFilesModel.renameFile(file,function(){
				$scope.$apply();
			});
		}
	}
	function openFolder(folder){
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
	function sortFiles(by,bDesc){ // todo: move to model
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