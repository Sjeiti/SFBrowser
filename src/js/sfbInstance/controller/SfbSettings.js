angular.module('sfbInstance').controller('SfbSettings',function(
	$scope
	,$translate
	,SfbConfig
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
	$scope.lang = oLanguages[SfbConfig.lang];
	$translate.uses($scope.lang.iso);
	$scope.$watch('lang',function(newVal,oldVal){
		if (oldVal!==newVal) {
			var sIso = newVal.iso;
			SfbConfig.save({lang:sIso});
			$translate.uses(sIso);
		}
	});
});