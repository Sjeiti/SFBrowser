angular.module('sfbrowser').factory('Api',function($resource){
	'use strict';
	var sUriAPI = 'connector/php'
		,sBase = encodeURIComponent('../../data/');
	return $resource(sUriAPI,{},{
		list: {
			url: sUriAPI+'/list/:base:folder'
			,method: 'POST'
			, params:{
				base:sBase
				,folder:'@folder'
			}
		}
		,delete: {
			url: sUriAPI+'/delete/:base:file'
			,method: 'POST'
			, params:{
				base:sBase
				,file:'@file'
			}
		}
		,rename: {
			url: sUriAPI+'/rename/:base:file/:base:to'
			,method: 'POST'
			, params:{
				base:sBase
				,file:'@file'
				,to:'@to'
			}
		}
	});
});