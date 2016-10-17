"use strict";

(function (angular) {
	var app = angular.module('app');

    function controller($scope, $http) {
        this.ERR = window.$errors.ERR;

        this.setError = function(code, details) {
            switch(code) {
                case this.ERR.MONGO.CONN_EMPTY: this.error = 'Please, enter connection string. '; break;
                case this.ERR.MONGO.CONN_FORMAT: this.error = 'Connection string should have format: "mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]". '; break;
                case this.ERR.MONGO.CONN_TIMED_OUT: this.error = 'The request to the server timed out. '; break;
                case this.ERR.MONGO.CONN_AUTH: this.error = 'Authentication failed. '; break;
                case this.ERR.MONGO.CONN_NO_SERVER: this.error = 'Could not connect to the server. '; break;
                case this.ERR.MONGO.QUERY_EMPTY: this.error = 'Please, enter the query. To select all documents, enter empty object: "{}". '; break;
                case this.ERR.MONGO.QUERY_FORMAT: this.error = 'Please, fix the query to be correct JSON. '; break;
                case this.ERR.MONGO.QUERY_EXECUTION: this.error = 'Failed to execute query. '; break;
                case this.ERR.MONGO.EMPTY_COLLECTION: this.error = 'Collection cannot be empty. '; break;
                default: this.error = 'Error: ' + code + '. ';
            }
            if (details) this.error += details;
         }
    
        this.validateCollection = function () {
            if (!this.shared.db.selectedQuery.collection){
                this.setError(window.$errors.ERR.MONGO.EMPTY_COLLECTION);
                return false;
            }
            return true;
        };

        // Returns query object.
        this.validateQuery = function() {
            if (!this.shared.db.selectedQuery.code){
                this.setError(window.$errors.ERR.MONGO.QUERY_EMPTY);
                return false;
            }

            try {
                JSON.parse(this.shared.db.selectedQuery.code);
                return true;
            } catch (err) {
                this.setError(window.$errors.ERR.MONGO.QUERY_FORMAT, err.message);
                return false;
            }
        };

        this.setResult = function (text) {
            var oldShowResult = this.shared.showResult;
			var el = document.getElementById('result'); // We do not use angular here, because of html table.
            el.innerHTML = text;
            
            this.shared.showResult = text ? true : false;

            if (!this.shared.showResult) return;
            var scope = this;
            if (oldShowResult) {
                this.scrollTo("#resultHeader");
            } else {
                this.shared.$timeout(function () {
                    scope.shared.$document.scrollToElement(el, 0, 500);
                }, 100);
            }
        }
        
        this.scrollTo = function (selector) {
            var element = angular.element(selector);
            this.shared.$document.scrollToElement(element, 0, 500);
		}

        this.deliverResult = function(arr){
			this.setResult('');
			var filename = this.shared.db.selectedQuery.collection;
            var result = '';
            
			switch (this.shared.run.format){
                case "json":
                    if (this.shared.run.delivery == "page") {
                        result = '<pre>' + JSON.stringify(arr, null, 4) + '</pre>';
                    } else {
                        result = JSON.stringify(arr);
					}
					filename = filename + ".json";
					break;
				case "csv":
					var lineSeparator = "\n";
					if (this.shared.run.delivery == "page"){
						lineSeparator = "<br>";
					}
					result = window.$helpers.arrayToCSV(arr, lineSeparator);
					filename = filename + ".csv";
					break;
				case "html":
					var tableClass = "";
					if (this.shared.run.delivery == "page"){
						tableClass = "w3-table w3-bordered w3-striped";
					}
					result = window.$helpers.arrayToHTMLTable(arr, tableClass, window.$constants.COL_LIMIT); 
					filename = filename + ".html";
					break;
			}
            
            if (this.shared.run.delivery == "page") {
                this.setResult(result);
			} else if (this.shared.run.delivery == "file"){
				this.setResult("Download started...");
				window.$helpers.download(filename, result);
			} else {
                this.setError("Unexpected delivery value: " + this.shared.run.delivery);
			}	

		}

        this.run = function() {
            this.shared.data = '';
            this.error = '';
            if (!this.validateCollection()) return;
            if (!this.validateQuery()) return;
            this.shared.runProgress = true;
            this.shared.result = null;

            var scope = this;
            var input = {
                conn: scope.shared.db.connectionString,
                coll: scope.shared.db.selectedQuery.collection,
                q: scope.shared.db.selectedQuery.code,
                operation: scope.shared.db.selectedQuery.operation
            };
            
            $http({ url: "../api/runQuery", method: "GET", params: input} 
            ).then(
                function (response) {
                    scope.shared.runProgress = false;
                    if (response.data.res) {
                        scope.deliverResult(response.data.res);
                    } else if (response.data.err) {
                        scope.setError(response.data.err.code, response.data.err.details);
                    } else {
                        scope.setError(window.$errors.ERR.SERVER_UNEXPECTED);
                    }
                },
                function (err) {
                    scope.shared.runProgress = false;
                    scope.setError(window.$errors.ERR.CLIENT_UNEXPECTED);
                }
            );
        }
        
    }

    app.component('myQuery', {
        templateUrl: 'app/components/query.html',
        controller: controller,
        bindings: {
            shared: '='
        }
    });

})(window.angular);