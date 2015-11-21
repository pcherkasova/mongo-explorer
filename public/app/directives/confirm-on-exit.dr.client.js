"use strict";
(function (angular) {

    var app = angular.module('app');
    app.directive('confirmOnExit', function() {
            return {
                link: function($scope, elem, attrs, ctrl) {
                    window.onbeforeunload = function(){
                        if ($scope[attrs["name"]].$dirty) {
                            return "Your edits will be lost.";
                        }
                    }
                }
            };
        });
})(window.angular);