"use strict";


(function (angular) {
	var app = angular.module('app');

	app.controller('QueryCtrl', ["$timeout",  "$http", '$document', '$compile', function ($timeout, $http, $document, $compile) {
		
		// form validation
		// we do not use angular form validation, because of mutual dependancy of controls and overall complexity of the form
		this.validateConnection = function () {
			if (!this.input.connection.value) {
				this.output.lastError.set(window.$errors.ERR.MONGO.CONN_EMPTY);
				return false;
			}
			return true;
		};
		this.validateCollection = function () {
			if (!this.input.collection.value){
				this.output.lastError.set(window.$errors.ERR.MONGO.EMPTY_COLLECTION);
				return false;
			}
			return true;
		};
		// returns query object
		this.validateQuery = function () {
			var res = false;
			if (!this.input.query.value){
				this.output.lastError.set(window.$errors.ERR.MONGO.QUERY_EMPTY);
				return res;
			}
			try {
				res = JSON.parse(this.input.query.value);
			} catch (err) {
				this.output.lastError.set(window.$errors.ERR.MONGO.QUERY_FORMAT);
				return res;
			}
			return res;
		};
		
		this.refreshCollections = function () {
			this.input.collection.options = [];
			this.input.collection.value = '';
			this.output.lastError.set(window.$errors.ERR.NO_ERROR);
			if (!this.validateConnection()) return;
			this.output.refreshCollectionsProgress = true;
			
			var scope = this;
			
			$http({url: "../api/getCollections", method: "GET", params: { conn: this.input.connection.value }}
			).then(
				function (response) {
					
					scope.output.refreshCollectionsProgress = false;
					
					if (response.data.res) {
						scope.input.collection.options = response.data.res;
						scope.input.collection.value = response.data.res[Math.min(2, response.data.res.length - 1)].name;
					} else if (response.data.err) { 
						scope.output.lastError.set(response.data.err.code);
						scope.output.lastErrorDetails = response.data.err.details;
					} else {
						scope.setUnexpectedClientError("GetCollections returned unexpected response.");
					};
    					
				}, 
				function (err) {
					scope.output.refreshCollectionsProgress = false;
					scope.setUnexpectedClientError("Failed to call getCollections: " + err);
				}
			);
		}
		
		this.runQuery = function () {
			this.setResult("");
			this.output.lastError.set(window.$errors.ERR.NO_ERROR);
			if (!this.validateConnection()) return;
			if (!this.validateCollection()) return;
			var q = this.validateQuery();
			if (!q) return;
			
			
			this.output.runQueryProgress = true;

			var input = {
				conn: this.input.connection.value,
				coll: this.input.collection.value,
				q: JSON.stringify(q),
				operation: this.input.operation.value
			};

			var scope = this;
			$http({ url: "../api/runQuery", method: "GET", params: input} // we use extra json because angular one does not work for array of objects
				).then(
				function (response) {
					scope.output.runQueryProgress = false;
					if (response.data.res) {
						scope.deliverResult(response.data.res);
					} else if (response.data.err) {
						scope.output.lastError.set(response.data.err.code);
						scope.output.lastErrorDetails = response.data.err.details;
					} else {
						scope.setUnexpectedClientError("RunQuery returned unexpected response.");
					}
				
				},
					function (err) {
						this.output.runQueryProgress = false;
						this.setUnexpectedClientError("Failed to call runQuery: " + err);
					}
				);
		}	

		this.updateExample = function () {
			var update = true;
	
			switch (this.input.query.value){
				case "": case window.$constants.FIND_QUERY: case window.$constants.AGGREGATE_QUERY: break;
				default: update = (confirm("Do you want to replace the query text with example?"));
			}
			
			if (!update) return;
			
			switch (this.input.operation.value) {
				case "find": this.input.query.value = window.$constants.FIND_QUERY; break;
				case "aggr": this.input.query.value = window.$constants.AGGREGATE_QUERY; break;
				default: this.setUnexpectedClientError("Wrong name of operation: " + this.input.operation.value + ".");
			}
		}
		
		
		this.setUnexpectedClientError = function (description) {
			this.output.lastError.set(this.errors.ERR.CLIENT_UNEXPECTED);
			this.output.lastErrorDetails = description;
		}
		
		
		this.scrollTo = function (selector) {
			console.log("scroll to " + selector);
			
			var element = angular.element(selector);
			$document.scrollToElement(element, 0, 500);
		}
		
		
		this.deliverResult = function(arr){
			
			var filename = this.input.collection.value;
			var result = "";
			
			switch (this.input.format.value){
				case "json":
					result = JSON.stringify(arr);
					filename = filename + ".json";
					break;
				case "csv":
					var lineSeparator = "\n";
					if (this.input.delivery.value == "web"){
						lineSeparator = "<br>";
					} 
					result = window.$helpers.arrayToCSV(arr, lineSeparator);
					filename = filename + ".csv";
					break;
				case "html":
					var tableClass = "";
					if (this.input.delivery.value == "web"){
						tableClass = "w3-table w3-bordered w3-striped";
					}
					result = window.$constants.arrayToHTMLTable(arr, tableClass, window.$constants.COL_LIMIT); 
					filename = filename + ".html";
					break;
			}
			
			if (this.input.delivery.value == "web") {
				this.setResult(result);
				this.scrollTo("#resultHeader");
			} else if (this.input.delivery.value == "file"){
				this.setResult("Download started...");
				this.scrollTo("#resultHeader");
				window.$helpers.download(filename, result);
			} else {
				this.setUnexpectedClientError("Unexpected delivery value: " + this.input.delivery.value);
			}	

		}
		
		this.setResult = function(text){
			var el = document.getElementById('result'); // we do not use angular here, because of html table
			el.innerHTML = text;
		}
	
		
		this.input = {
			connection: {
				value: window.$constants.DEMO_DB
			},
			
			collection: {
				options: [],
				value: ''
			},
			
			query: 	{
				value: window.$constants.FIND_QUERY
			},
			
			format:{
				options: [
					{ value: "json", display: "JSON" },
					{ value: "csv", display: "CSV" },
					{ value: "html", display: "HTML (up to " + window.$constants.COL_LIMIT + " cols)" }],
				value: "json"
			},
			
			delivery:{
				options: [
					{ value: "web", display: "This web page" },
					{ value: "file", display: "File" }],
				value: "web"
			},
			
			operation:{
				options: [
					{ value: "find", display: "Find", ref: "http://docs.mongodb.org/manual/reference/method/db.collection.find/"},
					{ value: "aggr", display: "Aggregate", ref: "http://docs.mongodb.org/manual/reference/method/db.collection.aggregate/" }],
				value: "find"
			},
			
			
		};
		
		
		this.output = {
			lastError: (function (scope) {
				var closure = window.$errors.ERR.NO_ERROR;
				return {
					get: function () {  return closure; },
					set: function (value) { 
						closure = value;
						if (closure != window.$errors.ERR.NO_ERROR) 
							scope.scrollTo("#" + scope.output.getWrongControl() + "Header"); 
					}
				}
			} (this)),
			
			getWrongControl: function(){
				switch (this.lastError.get()) {
					case window.$errors.ERR.NO_ERROR: return "";
					case window.$errors.ERR.MONGO.CONN_EMPTY:
					case window.$errors.ERR.MONGO.CONN_FORMAT:
					case window.$errors.ERR.MONGO.CONN_TIMED_OUT:
					case window.$errors.ERR.MONGO.CONN_NO_SERVER:
					case window.$errors.ERR.MONGO.CONN_AUTH: return"conection";
					case window.$errors.ERR.MONGO.EMPTY_COLLECTION: return "collection"; 
					case window.$errors.ERR.MONGO.QUERY_EMPTY:
					case window.$errors.ERR.MONGO.QUERY_FORMAT:
					case window.$errors.ERR.MONGO.QUERY_EXECUTION:
					case window.$errors.ERR.CLIENT_UNEXPECTED:return "query";
					default: return "";
				}
			},
				
			lastErrorDetails: "",	
			
			refreshCollectionsProgress: false,
			
			runQueryProgress: false
			
		}
		
		this.constant = {
			resultHeader: "Result (top " + window.$constants.ROW_LIMIT + " documents)",
			errors: window.$errors.ERR.MONGO
		}

		this.refreshCollections(); 

  }]);
    
})(window.angular);