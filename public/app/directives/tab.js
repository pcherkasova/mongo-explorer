"use strict";

(function (angular) {
	var app = angular.module('app');
    
    app.controller('TabCtrl', function (){
        this.tabIndex = 0;
     
        this.select = function (index){
            this.tabIndex = index;
        };

        this.isSelected = function(index) {
            return this.tabIndex === index;
        };
    });
    
})(window.angular);    