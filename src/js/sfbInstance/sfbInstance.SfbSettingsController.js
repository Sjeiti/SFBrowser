angular.module('sfbInstance').controller('SfbSettingsController',function($scope,$translate) {
	'use strict';
	this.languages = [
		{name: 'English',iso: 'en'}
		,{name: 'Dutch',iso: 'nl'}
		,{name: 'German',iso: 'de'}
	];
	$scope.lang = this.languages[0];
	$scope.$watch('lang',function(newVal,oldVal){
		if (oldVal!==newVal) {
			$translate.uses(newVal.iso);
		}
	});
});