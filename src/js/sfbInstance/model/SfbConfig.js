angular.module('sfbInstance').factory('SfbConfig',function(parsedConfig){
	'use strict';
	var	oDefaultModel = {
			id: ''
			,title: 'SFBrowser'
			,folder: ''
			,baseFolder: ''
			,lang: 'en'
			,x:0
			,y:0
			,w:0
			,h:0
			,allowedTypes: [] // todo: implement allowedTypes
			,deniedTypes: [] // todo: implement deniedTypes
			,allowUpload: true // todo: implement allowUpload
			,allowDirectories: true // todo: implement allowDirectories
			,selectNum: 0 // todo: implement selectNum
			,localStorage: 0 // todo: implement not use of localStorage
			,copyRelative: '' // todo: implement copyRelative
			//
			,img: '' // todo: implement img preview
			,ascii: '' // todo: implement ascii preview
			,movie: '' // todo: implement movie preview
			//
			,inline: false // todo: implement inline
			//
			,connector: '' // todo: implement connector
			//
			// below doesn't save with localStorage
			,callback: function(files){
				console.log(files);
			}
			,save: save
			,set: set
		}
		,sId = parsedConfig.id||oDefaultModel.id
		,oModel = angular.extend(oDefaultModel,angular.fromJson(localStorage[sId])||{});
	save(parsedConfig);
	function save(obj){
		oModel = obj===undefined?oModel:angular.extend(oModel,obj);
		localStorage[sId] = angular.toJson(oModel);
		return oModel;
	}
	function set(key,value){
		oModel[key] = value;
		return save();
	}
	return oModel;
});