angular.module('sfbInstance').factory( 'SfbFilesModel', function(Api) {
	'use strict';
	var sBaseFolder = 'data/'
		,aUploads = []
		,aCurrentList
		,oReturn = {
			currentFolder: ''
			,uploads: aUploads
			,getList: getList
			,deleteFile: deleteFile
			,renameFile: renameFile
			,uploadFiles: uploadFiles
		}
	;
	function getList(folder,callback){
		var sNewFolder = oReturn.currentFolder+'/'+(folder||'');
		Api.list({folder:encodeURIComponent(sNewFolder)},function(result) {
			if (result.success) {
				oReturn.currentFolder = sNewFolder;
				result.data.forEach(function(file){
					var bWH = file.width&&file.height;
					file.originalName = file.name;
					file.path = sBaseFolder+oReturn.currentFolder;
					file.surface = bWH?file.width*file.height:'';
					file.dimensions = bWH?(file.width+' x '+file.height):'';
					file.sizeFormatted = file.type!=='dir'?formatSize(file.size):'';
					file.nameEditing = false;

				});
				aCurrentList = result.data;
				callback(result.data);
			} else {
				console.log('result.error',result.error); // todo: handle error
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
					console.log('result.error',result.error); // todo: handle error
				}
				callback(result.success);
			});
		}
	}
	// lastModified: 1284304240000
	// lastModifiedDate: Sun Sep 12 2010 17:10:40 GMT+0200 (W. Europe Daylight Time)
	// name: "P1020179.JPG"
	// size: 2942741
	// type: "image/jpeg"
	// webkitRelativePath: ""
	function uploadFiles(files,progress,complete){
		for (var i=0,l=files.length;i<l;i++) {
			aUploads.push(angular.extend(files[i],{
				progress: 0
			}));
		}
		uploadFile(progress,complete);
	}
	//
    function uploadFile(progress,complete) {
        var oFormData = new FormData()
			,oUploadFile = aUploads[0]
		;
        oFormData.append('folder',oReturn.currentFolder);
        oFormData.append('file',oUploadFile);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', handleUploadProgress, false);
        xhr.addEventListener('load', handleUploadComplete, false);
        xhr.addEventListener('error', handleUploadFailed, false);
        xhr.addEventListener('abort', handleUploadCanceled, false);
        xhr.open('POST', 'connector/php/upload');
        xhr.send(oFormData);

		function handleUploadProgress(e){
			if (e.lengthComputable) {
				oUploadFile.progress = 100*e.loaded/e.total<<0;
				progress();
			}
		}
		function handleUploadComplete(e){
			// todo: add response error to json
			var sJsonString = e.currentTarget.response.match(/{.*}/g)[0]
				,oResponse = JSON.parse(sJsonString)
				,iIndex = aUploads.indexOf(oUploadFile);
			aUploads.splice(iIndex,1);
			if (oResponse.success) {
				aCurrentList.push(oResponse.data.pop());
			}
			if (aUploads.length===0) {
				complete(oResponse.success);
			} else {
				progress();
				uploadFile(progress,complete);
			}
		}
		function handleUploadFailed(e){console.log('uploadFailed',e);}
		function handleUploadCanceled(e){console.log('uploadCanceled',e);}
    }
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
	//
	return oReturn;
});