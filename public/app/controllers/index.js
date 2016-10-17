"use strict";

(function (angular) {
	var app = angular.module('app');

    app.controller('MainCtrl',
                ['$scope', '$cookies', '$document', '$timeout', '$modal',
        function ($scope,   $cookies,   $document,   $timeout,   $modal) {
    
        // var t = '';
        // for (var p in $document) {
        //     t += p + ', ';
        // };

        // alert(t);
            
        this.shared = {
            selectQuery: function(index) {
                this.db.selectedQueryIndex = index;
                this.db.selectedQuery = this.db.inventory.queries[index];
            },
            
            isProgress: function() {
                return (this.connectProgress || this.saveProgress || this.runProgress);
            },
            
            demoDB: window.$constants.DEMO_DB,
            $cookies: $cookies,
            $document: $document,
            $scope: $scope,
            $timeout: $timeout,
            $modal: $modal,

            connectProgress: false,
            saveProgress: false,
            runProgress: false,

            db: {
                selectedQueryIndex: -1,
                selectedQuery: null,
                modified: false,
                connectionString: window.$constants.DEMO_DB, 
                inventory: null
            },

            run: {
                delivery: 'page',
                format: 'html'
            }
        }
    }]);

})(window.angular);    