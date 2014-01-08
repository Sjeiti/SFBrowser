/*global oSFBInjector*/
angular.module('sfbInstance').factory( 'SfbFilesModel', function(SfbConfig){
	'use strict';
	var Api = oSFBInjector.get('Api') // we do not use require because sfbrowser must remain a singleton
//		,sBaseFolder = ''
		,aUploads = []
		,bUploading = false
		,aCurrentList
		,oReturn = {
			currentFolder: SfbConfig.folder
			,uploads: aUploads
			,getList: getList
			,deleteFile: deleteFile
			,renameFile: renameFile
			,moveFiles: moveFiles
			,uploadFiles: uploadFiles
			,abortUpload: abortUpload
			,newFolder: newFolder
		}
	;
	function getList(folder,callback){
		var sNewFolder = path(oReturn.currentFolder+'/'+(folder||''));
		Api.list({folder:encodeURIComponent(sNewFolder)},function(result) {
			if (result.success) {
				aCurrentList = result.data;
				oReturn.currentFolder = sNewFolder;
				var bIsRelativeRoot = oReturn.currentFolder===SfbConfig.folder
					,aRemove = [];
				aCurrentList.forEach(function(file){
					processFile(file);
					if (bIsRelativeRoot&&file.type==='dir'&&file.name==='..'){
						aRemove.push(file);
					}
				});
				aRemove.forEach(function(file){
					aCurrentList.splice(aCurrentList.indexOf(file),1);
				});
				callback(aCurrentList);
			} else {
				console.log('result.error',result.error); // todo: handle getList error
			}
		});
	}
	function deleteFile(file,callback){
		Api.delete({file:encodeURIComponent(oReturn.currentFolder+'/'+file.name)},function(result) {
			if (result.success) {
				var iIndex = aCurrentList.indexOf(file);
				if (iIndex!==-1) {
					aCurrentList.splice(iIndex,1);
				}
			} else {
				console.log('result.error',result.error);
			}
			callback(result.success);
		});
	}
	function renameFile(file,callback){
		if (file.name!==file.originalName) {
			Api.rename({
				file:encodeURIComponent(oReturn.currentFolder+'/'+file.originalName)
				,to:encodeURIComponent(oReturn.currentFolder+'/'+file.name)
			},function(result) {
				if (result.success) {
					file.originalName = file.name;
				} else {
					file.name = file.originalName;
					console.log('result.error',result.error); // todo: handle renameFile error
				}
				callback(result.success);
			});
		}
	}
	function moveFiles(files,target,callback){
		if (target.type==='dir') {
			if (files.indexOf(target)===-1) {
				var aFiles = [];
				files.forEach(function(file){
					aFiles.push(encodeURIComponent(file.name));
				});
				Api.move({
					target: encodeURIComponent(oReturn.currentFolder+'/'+target.name)
					,current:encodeURIComponent(oReturn.currentFolder)
					,files:aFiles//.join('/')
				},function(result) {
					if (result.success) {
						files.forEach(function(file){
							var iIndex = aCurrentList.indexOf(file);
							aCurrentList.splice(iIndex,1);
						});
					}
					callback(result.success);
				});
			} else {
				console.log('cannot move inside itself'); // todo: handle moveFiles error
			}
		}
	}
	function uploadFiles(files,progress,complete){
		for (var i=0,l=files.length;i<l;i++) {
			aUploads.push(angular.extend(files[i],{
				progress: 0
			}));
		}
		if (!bUploading) uploadFile(progress,complete);
	}
	function abortUpload(file){
		if (file.xhr) file.xhr.abort();
		else removeFromUploads(file);
	}
	function newFolder(callback){
		Api.newFolder({
			folder:encodeURIComponent(oReturn.currentFolder)
		},function(result) {
			if (result.success) {
				addFilesToList(result.data);
			} else {
				console.log('result.error',result.error);
			}
			callback(result.success,result.data);
		});
	}
	//
	// lastModified: 1284304240000
	// lastModifiedDate: Sun Sep 12 2010 17:10:40 GMT+0200 (W. Europe Daylight Time)
	// name: "P1020179.JPG"
	// size: 2942741
	// type: "image/jpeg"
	// webkitRelativePath: ""
    function uploadFile(progress,complete) {
        var oFormData = new FormData()
			,oUploadFile = aUploads[0]
			,oXHR = new XMLHttpRequest()
		;
		oUploadFile.xhr = oXHR;
        oFormData.append('folder',oReturn.currentFolder);
        oFormData.append('file',oUploadFile);
        oXHR.upload.addEventListener('progress', handleUploadProgress, false);
        oXHR.addEventListener('load', handleUploadComplete, false);
        oXHR.addEventListener('error', handleUploadFailed, false);
        oXHR.addEventListener('abort', handleUploadCanceled, false);
        oXHR.open('POST', 'connector/php/upload');
        oXHR.send(oFormData);
		bUploading = true;
		function handleUploadProgress(e){
			if (e.lengthComputable) {
				oUploadFile.progress = 100*e.loaded/e.total<<0;
				progress();
			}
		}
		function handleUploadComplete(e){
			// todo: add response error to json (sometimes no json when large files)
			var aJsonString = e.currentTarget.response.match(/{.*}/g)
				,oResponse = aJsonString?JSON.parse(aJsonString[0]):{success:false}
			;
			bUploading = false;
			if (oResponse.success) {
				addFilesToList(oResponse.data.pop());
			}
			if (!nextUpload()) {
				complete(oResponse.success);
			}
		}
		function handleUploadFailed(){
			nextUpload();
		}
		function handleUploadCanceled(){
			nextUpload();
		}
		function nextUpload(){
			removeFromUploads(oUploadFile);
			var bRemainingUploads = aUploads.length>0;
			if (bRemainingUploads) uploadFile(progress,complete);
			progress();
			return bRemainingUploads;
		}
    }
	function removeFromUploads(file){
		var iIndex = aUploads.indexOf(file);
		aUploads.splice(iIndex,1);
	}
	function addFilesToList(files){
		if (Array.isArray(files)) {
			files.forEach(processFile);
			Array.prototype.push.apply(aCurrentList,files);
		} else {
			processFile(files);
			aCurrentList.push(files);
		}
	}

	/**
	 * Adds variables to the file object to be used in the view
	 * @param {object} file
	 * @returns {object}
	 */
	function processFile(file){
		var bWH = file.width&&file.height;
		file.originalName = file.name;
		file.path = path(SfbConfig.baseFolder,oReturn.currentFolder);
		file.surface = bWH?file.width*file.height:'';
		file.dimensions = bWH?(file.width+' x '+file.height):'';
		file.sizeFormatted = file.type!=='dir'?formatSize(file.size):'';
		file.nameEditing = false;
		file.selected = false;
		return file;
	}

	/**
	 * Formats a number to the appropriate filesize notation
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

	/**
	 * Builds and cleans a path
	 * @param {string} [...] Path elements
	 * @returns {string}
	 */
	function path(){
		var sPath = Array.prototype.join.apply(arguments,['/'])
			,sPath_;
		while (sPath!==sPath_) {
			sPath_ = n(sPath);
			sPath = n(sPath_);
		}
		function n(s){return s.replace(/\/+/g,'/').replace(/\w+\/+\.\./g,'');}
		return sPath.replace(/^\//,'').replace(/\/$/,'');
	}
	//
	return oReturn;
});