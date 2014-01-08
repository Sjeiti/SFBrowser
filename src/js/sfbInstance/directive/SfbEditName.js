angular.module('sfbInstance').directive('editName', function () {
    'use strict';
    return function ($scope, $element) {
		$scope.$watch('file.nameEditing',function(){
			var oFile = $scope.file
				,mFile = $element[0];
			if (oFile.nameEditing) {
				mFile.removeAttribute('disabled');
				if (oFile.type==='dir') {
					mFile.select();
				} else {
					mFile.setSelectionRange(0,oFile.name.lastIndexOf('.'));
				}
			} else {
				mFile.setAttribute('disabled');
			}
		});
    };
});