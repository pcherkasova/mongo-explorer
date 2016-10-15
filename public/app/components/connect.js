"use strict";

(function (angular) {
	var app = angular.module('app');

    function controller($scope, $http) {
        this.ERR = window.$errors.ERR;
   
        this.myDB = this.shared.cookies.get('myDB');
        if (!this.myDB) this.myDB = '';
  
        this.connect = function() {
            if (this.remember) {
                this.shared.cookies.put('myDB', this.shared.db.connectionString);
                this.myDB = this.shared.db.connectionString;
            }
            var scope = this;
            scope.progress = true;
			scope.shared.db.inventory = null;
            scope.error = 0;
            
            $http({url: "../api/connect", method: "GET", params: { conn: scope.shared.db.connectionString }})
            .then(
				function (response) {
                    scope.progress = false;

					if (response.data.res) {
                        scope.shared.db.inventory = response.data.res;
                        scope.shared.selectedQuery = 0;
					} else if (response.data.err) { 
						scope.error = response.data.err.code;
						scope.errorDetails = response.data.err.details;
                    } else {
                        scope.error = window.$errors.ERR.CLIENT_UNEXPECTED;
                    };
				}, 
				function (err) {
                    scope.error = window.$errors.ERR.SERVER_UNEXPECTED;
					scope.progress = false;
				}
			);
        };

        this.setMy = function() {
            this.setConnectionString(this.myDB);
            this.remember = true;
        }

        this.setDemo = function() {
            this.setConnectionString(this.shared.demoDB);
            this.remember = false;
        }

        this.setConnectionString = function(val) {
            if (this.shared.db.connectionString == val) return;
            this.shared.db.connectionString = val;
            this.shared.db.inventory = null;
        }
        
        this.shared.db = {};
        this.shared.db.connectionString = this.shared.demoDB;
        this.connect();
    }

    app.component('myConnect', {
        templateUrl: 'app/components/connect.html',
        controller: controller,
        bindings: {
            shared: '='
        }
    });

})(window.angular);