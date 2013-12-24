angular.module('sfbrowser').factory('Api',function($resource){
	return $resource(
		sUriAPI+'/list/:base:folder'
		,{}
		,{
			list: {
				method: 'POST'
				, params:{
					base:encodeURIComponent('../../data/')
					,folder:'@folder'
				}
				, isArray: false
			}
		}
	);
});