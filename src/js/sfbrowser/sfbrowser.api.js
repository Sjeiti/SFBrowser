angular.module('sfbrowser').factory('Api',function($resource){
	'use strict';
	// todo: see: http://blog.brunoscopelliti.com/authentication-to-a-restful-web-service-in-an-angularjs-web-app
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
		,move: {
			url: sUriAPI+'/move/:base:target/:base:current/:files'
			,method: 'POST'
			, params:{
				base:sBase
				,target:'@target'
				,current:'@current'
				,files:'@files'
			}
		}
		,newFolder: {
			url: sUriAPI+'/newfolder/:base:folder'
			,method: 'POST'
			, params:{
				base:sBase
				,folder:'@folder'
			}
		}
		/*,upload: {
			url: sUriAPI+'/upload/:base:folder'
			,method: 'POST'
			, params:{
				base:sBase
				,folder:'@folder'
			}
		}*/
	});
});