"use strict";

(function (angular) {
	var app = angular.module('app');

    app.controller('MainCtrl', ['$scope', '$cookies', function($scope, $cookies) {
        this.shared = {
            demoDB: window.$constants.DEMO_DB,
            cookies: $cookies,
            db: {
                selectedQuery: 0,
                modified: false,
                inventory: null

            },
        }
    }]);

})(window.angular);    