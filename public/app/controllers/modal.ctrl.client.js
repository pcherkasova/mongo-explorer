"use strict";
(function (angular) {

  var app = angular.module('app');
  app.controller('PrivacyPolicyCtrl', ["$scope", "$modal", "$log", function ($scope, $modal, $log) {

		
		$scope.animationsEnabled = true;
		
		$scope.open = function (size) {
		
			var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'privacyPolicyContent.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
				return $scope.items;
				}
			}
			});
		
			modalInstance.result.then(function (selectedItem) {
			}, function () {
			$log.info('Modal dismissed at: ' + new Date());
			});
		};
		
		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};
	}]);
		
		// Please note that $modalInstance represents a modal window (instance) dependency.
		// It is not the same as the $modal service used above.
		
	app.controller('ModalInstanceCtrl', ["$scope", "$modalInstance", function ($scope, $modalInstance) {
		
		
		
		$scope.ok = function () {
			$modalInstance.close("some result");
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);
	

})(window.angular);