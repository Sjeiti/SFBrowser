angular.module('sfbInstance').directive('editName', function () {
    'use strict';
    return function ($scope, $element) {
		$scope.$watch('file.nameEditing',function(){
			var mFile = $element[0];
			if ($scope.file.nameEditing) {
				mFile.removeAttribute('disabled');
				mFile.select();
			} else {
				mFile.setAttribute('disabled');
			}
		});
    };
});