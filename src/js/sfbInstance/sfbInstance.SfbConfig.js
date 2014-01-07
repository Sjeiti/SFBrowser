angular.module('sfbInstance').factory('SfbConfig',function(){
	'use strict';
	var oModel = angular.extend({
		folder: ''
		,lang: 'en'
		,x:0
		,y:0
		,w:0
		,h:0
		// below doesn't save with localStorage
		,callback: function(files){
			console.log(files);
		}
		,save: save
		,set: set
	},angular.fromJson(localStorage.sfb)||{});
	function save(obj){
		oModel = obj===undefined?oModel:angular.extend(oModel,obj);
		localStorage.sfb = angular.toJson(oModel);
		return oModel;
	}
	function set(key,value){
		oModel[key] = value;
		return save();
	}
	return oModel;
});