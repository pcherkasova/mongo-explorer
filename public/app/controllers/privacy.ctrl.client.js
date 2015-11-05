"use strict";
(function (angular) {

  var app = angular.module('app');
  app.controller('PrivacyPolicyCtrl', [ "$modal", function ( $modal) {

		this.open = function (size) {
		
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'privacyPolicyContent.html',
				controller: 'ModalInstanceCtrl as modalInstance',
				size: size,
				resolve: {}
				
			});
		
			modalInstance.result.then(function (selectedItem) {
			}, function () {
				
			});
		};
		
		
	}]);
		
		
		
	app.controller('ModalInstanceCtrl', ["$modalInstance", function ( $modalInstance) {
		this.ok = function () {
			$modalInstance.close();
		};
	}]);
	

})(window.angular);