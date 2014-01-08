/**
 * Calculate icon offset by extension
 * @param file
 * @returns {string}
 */
angular.module('sfbInstance').directive('iconPosition', function () {
    'use strict';
	var oPosition = {};
	function iconPosition($element,type,ext){
		// todo: check http://www.mailbigfile.com/101-most-popular-file-types/
		var sKey = type+ext
			,sValue = oPosition[sKey];
		if (!sValue) {
			var iHo = ext.charCodeAt(0)-97
				,iVo = ext.charCodeAt(1)-97;
			switch (type) {
				case 'dir':			iHo = 26; iVo = 2; break;
				case 'folderup':	iHo = 28; iVo = 2; break;
			}
			switch (ext) {
				case 'odg':	iHo = 26; break;
				case 'ods':	iHo = 27; break;
				case 'odp':	iHo = 28; break;
			}
			iHo *= -16;
			iVo *= -16;
			oPosition[sKey] = sValue = iHo+'px '+iVo+'px';
		}
		$element.css({backgroundPosition:sValue});
	}
    return function ($scope, $element) {
		iconPosition($element,$scope.file.type,$scope.file.ext);
    };
});