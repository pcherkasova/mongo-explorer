"use strict";
(function (angular) {

  var app = angular.module('app');
  app.controller('privacyPolicyCtrl', function ($scope, $modal, $log) {

		$scope.items = ['item1', 'item2', 'item3'];
		
		$scope.animationsEnabled = true;
		
		$scope.open = function (size) {
		
			var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'privacyPolicyContent.html',
			controller: 'modalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
				return $scope.items;
				}
			}
			});
		
			modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			}, function () {
			$log.info('Modal dismissed at: ' + new Date());
			});
		};
		
		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};
	});
		
		// Please note that $modalInstance represents a modal window (instance) dependency.
		// It is not the same as the $modal service used above.
		
	app.controller('modalInstanceCtrl', function ($scope, $modalInstance, items) {
		
		$scope.items = items;
		$scope.selected = {
			item: $scope.items[0]
		};
		
		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	});
	

})(window.angular);