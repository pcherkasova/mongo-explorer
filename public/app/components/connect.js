"use strict";

(function (angular) {
	var app = angular.module('app');

    function controller($scope, $http) {
        this.ERR = window.$errors.ERR;
   
        this.myDB = this.shared.$cookies.get('myDB');
        if (!this.myDB) this.myDB = '';

        this.setError = function(code, details) {
            switch(code) {
                case this.ERR.MONGO.CONN_EMPTY: this.error = 'Please, enter connection string. '; break;
                case this.ERR.MONGO.CONN_FORMAT: this.error = 'Connection string should have format: "mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]". '; break;
                case this.ERR.MONGO.CONN_TIMED_OUT: this.error = 'The request to the server timed out. '; break;
                case this.ERR.MONGO.CONN_AUTH: this.error = 'Authentication failed. '; break;
                case this.ERR.MONGO.CONN_NO_SERVER: this.error = 'Could not connect to the server. '; break;
                default: this.error = 'Error: ' + code + '. ';
            }
            if (details) this.error += details;
        }
  
        this.connect = function() {
            if (this.remember) {
                this.shared.$cookies.put('myDB', this.shared.db.connectionString);
                this.myDB = this.shared.db.connectionString;
            }
            var scope = this;
            scope.shared.connectProgress = true;
			scope.shared.db.inventory = null;
            scope.shared.db.modified = false;
            scope.error = '';
            
            $http({url: "../api/connect", method: "GET", params: { conn: scope.shared.db.connectionString }})
            .then(
				function (response) {
                    scope.shared.connectProgress = false;

					if (response.data.res) {
                        scope.shared.db.inventory = response.data.res;

                        scope.shared.sortQueries();
                        scope.shared.selectQuery(0);
					} else if (response.data.err) { 
						scope.setError(response.data.err.code, response.data.err.details);
                    } else {
                        scope.setError(window.$errors.ERR.CLIENT_UNEXPECTED);
                    };
				}, 
				function (err) {
                    alert(JSON.stringify(err));
                    scope.setError(window.$errors.ERR.SERVER_UNEXPECTED, err.data);
					scope.shared.connectProgress = false;
				}
			);
        };

        this.setMy = function() {
            this.remember = true;
            this.setConnectionString(this.myDB);
            
        }

        this.setDemo = function() {
            this.remember = false;
            this.setConnectionString(this.shared.demoDB);
        }

        this.setConnectionString = function(val) {
            if (this.shared.db.connectionString == val) return;
            this.shared.db.connectionString = val;
            this.shared.db.inventory = null;
            if (val) this.connect();
        }
        
        this.shared.db = {};
        
        if (this.myDB) this.setMy()
        else this.setDemo();

    }

    app.component('myConnect', {
        templateUrl: 'app/components/connect.html',
        controller: controller,
        bindings: {
            shared: '='
        }
    });

})(window.angular);