// "use strict";

// // https://www.npmjs.com/package/angulartics

// (function (angular) {
// 	var sink = angular.module('angulartics.sink', ['angulartics']);
// 	sink.config(['$analyticsProvider', '$http', function ($analyticsProvider, $http) {
// 		$analyticsProvider.registerPageTrack(function (path) {
// 			logUserEvent({ details: { path: path }, name: "load" });
		
// 		});
		
// 		$analyticsProvider.registerEventTrack(function (action, properties) {
// 			logUserEvent({ name: action, details: properties});	

// 		});
		
// 		this.logUserEvent = function (input){
// 			$http({ url: "../api/runQuery", method: "POST", params: input })
// 		}
				
// 	}]);
// })(window.angular);



  