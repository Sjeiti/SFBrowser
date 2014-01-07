angular.module('sfbInstance').controller('SfbSettingsController',function(
	$scope
	,$translate
	,SfbLocalStorageModel
) {
	'use strict';
	var oLanguages = {
			en:{name: 'English',iso: 'en'}
			,nl:{name: 'Dutch',iso: 'nl'}
			,de:{name: 'German',iso: 'de'}
		}
		,aLanguages = []
	;
	angular.forEach(oLanguages, function(lang){
		aLanguages.push(lang);
	});
	this.languages = aLanguages;
	$scope.lang = oLanguages[SfbLocalStorageModel.get('lang')];
	$translate.uses($scope.lang.iso);
	$scope.$watch('lang',function(newVal,oldVal){
		if (oldVal!==newVal) {
			var sIso = newVal.iso;
			SfbLocalStorageModel.save({lang:sIso});
			$translate.uses(sIso);
		}
	});
});