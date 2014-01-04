/* global oSFBInjector */
angular.module('sfbInstance',['ngAnimate','pascalprecht.translate'])
	.constant('Api',oSFBInjector.get('Api'))
	.constant('Key',oSFBInjector.get('Key'))
	.constant('$templateCache',oSFBInjector.get('$templateCache'))
	.config(function($provide,$translateProvider) {
		'use strict';
		angular.forEach(angular.extend({
			directory:''
			,callback: function(files){console.log(files);}
		},/*options*/{}),function(value,key) {
			$provide.value(key,value);
		});
		$translateProvider.translations({
			// window buttons
			fullscreen: 'fullscreen'
			,close: 'close'
			// main menu
			,newFolder: 'new folder'
			,upload: 'upload'
			,grid: 'grid'
			,settings: 'settings'
			// buttons below
			,select: 'Select'
			,cancel: 'Cancel'
			// table header
			,name: 'name'
			,type: 'type'
			,date: 'date'
			,size: 'size'
			,dimensions: 'dimensions'
			// item tr
			,download: 'download'
			,delete: 'delete'
		});
	})
;
/*include sfbInstance.SfbController.js*/
/*include sfbInstance.SfbFilesModel.js*/
/*include sfbInstance.SfbWindowModel.js*/
/*include sfbInstance.SfbWindowController.js*/
/*include sfbInstance.SfbMenuController.js*/
/*include sfbInstance.SfbFileTableController.js*/
/*include sfbInstance.SfbDragDirective.js*/
/*include sfbInstance.SfbResizeDirective.js*/
/*include sfbInstance.SfbFileDropDirective.js*/
