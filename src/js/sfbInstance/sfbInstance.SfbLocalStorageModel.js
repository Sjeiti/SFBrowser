angular.module('sfbInstance').factory('SfbLocalStorageModel', function(config){
	'use strict';
	// todo: we probably don't want to store the entire config model
    var	oModel = load();
	function load(){
		oModel = angular.fromJson(localStorage.sfb||config);
		return oModel;
	}
	function save(obj){
		oModel = obj===undefined?oModel:angular.extend(oModel,obj);
		localStorage.sfb = angular.toJson(oModel);
		return oModel;
	}
	function get(key){
		return oModel[key];
	}
	function set(key,value){
		oModel[key] = value;
		return save();
	}
    return {
		save: save
		,load: load
		,get: get
		,set: set
	};
});