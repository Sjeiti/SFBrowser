angular.module('sfbInstance').controller('sfbFileTableController',function($scope,$rootScope,Api,$element,callback,Key) {

	var sCurrentFolder = '';
	var oFileLastClicked;

	setFolder();

	Key.keyUp(function(keyCode){
		if (keyCode===Key.RETURN) {
			// todo: select file/folder and possibly close
		} else if (keyCode===Key.SPACE) {
			// todo: highlight file/folder
		} else if (keyCode===Key.ESC) {
			console.log('escape pressed'); // log
			$rootScope.$emit('close');
		} else {

		}
	});

	$rootScope.$on('move-files',function ($targetScope,x,y) {
		console.log('move-files',$targetScope,x,y); // log
	});

	$scope.handleFileKeyUp = function(e){
		if (e.keyCode===Key.RETURN) {
			renameFile(mInput);
		}
	};
	$scope.handleTrClick = function(e,file){
		var mTarget = e.target;
		checkEnabledInputs();
		if (!Key[Key.CTRL]) clearSelected();
		if (Key[Key.SHIFT]&&oFileLastClicked) {
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
		Api.list({folder:encodeURIComponent(sNewFolder)}).$promise.then(function(result){
			if (result.success) {
				sCurrentFolder = sNewFolder;
				$scope.files = result.data;
				$scope.$apply();
			} else {
				// todo: handle error
			}
		});
	}
});