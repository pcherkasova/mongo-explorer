"use strict";
(function (angular) {

  var app = angular.module('app');
  app.controller('AppCtrl', ["$scope", "$http", '$document', '$compile',function ($scope, $http, $document, $compile) {
		// scope function definitions
		
		$scope.refreshCollections = function () {
			$scope.data.collError = '';
			$scope.data.collection.options = [];
			$scope.data.collection.selected = "";
			$scope.data.collection.progress = true;
			
			$http({url: "../api/getCollections", method: "GET", params: { conn: $scope.data.connectionString }}
			).then(
				function (response) {
					if (response.data.res) {
						$scope.data.collection = {
							options: response.data.res,
							selected: response.data.res[Math.min(2, response.data.res.length - 1)].name
						}
						$scope.data.collError = '';
					} else if (response.data.err) { 
						$scope.data.collError = 'Cannot connect to the database';
						
					} else {
						$scope.data.collError = 'Unexpected error';
					}
					$scope.data.collection.progress = false;
				}, 
				function (err) {
					$scope.data.collError = 'Cannot connect to server';
					$scope.data.collection.progress = false;
					
				}
			);
		}
		
		$scope.updateExample = function () {
			var update = true;
	
			switch ($scope.data.query){
				case "": case exports.FIND_QUERY: case exports.AGGREGATE_QUERY: break;
				default: update = (confirm("Do you want to replace the query text with example?"));
			}
			
			if (!update) return;
			
			switch ($scope.data.operation.selected) {
				case "find": $scope.data.query = exports.FIND_QUERY; break;
				case "aggr": $scope.data.query = exports.AGGREGATE_QUERY; break;
				default: alert("wrong name of operation: " + $scope.data.operation.selected);
			}
		}
		
		$scope.STATUS = {
			NONE: 0,
			PROGRESS: 1,
			OPENING_FILE: 2,
			SHOWING_RESULT: 3,
			ERROR: 4,
			CANCELLED: 5
		}
		
		$scope.scrollTo = function (id) {
			var element = angular.element(document.getElementById(id));
            $document.scrollToElement(element, 0, 1000);
		}
		
		
		$scope.showStatus = function (status, details) {
			
			$scope.scrollTo("result");
				
			$scope.data.result.progress = (status === $scope.STATUS.PROGRESS);
			$scope.data.result.error = "";
			
			var result = "";
			
			switch (status) {
				case $scope.STATUS.OPENING_FILE: result = "Download started..."; break;
				case $scope.STATUS.SHOWING_RESULT: result = details; break;
				case $scope.STATUS.ERROR:
					if (details.operational) {
						$scope.data.result.error = details.errType + "<br>" + details.details;
					} else {
						$scope.data.result.error = "Unexpected error: " + JSON.stringify(details);
					}
						
					break;
				case $scope.STATUS.CANCELLED: $scope.data.result.error = "Request cancelled"; break;
			
			}
			
			var el = document.getElementById('result');
			el.innerHTML = result;
			
		}
		
		$scope.runQuery = function () {
			//$scope.abortQuery();
			if (!$scope.data.collection.selected) {
				alert("Please, select collection");
				return;
			}
			$scope.showStatus($scope.STATUS.PROGRESS);

			var input = {
				conn: $scope.data.connectionString,
				coll: $scope.data.collection.selected,
				q: $scope.data.query,
				operation: $scope.data.operation.selected
			};

			
			$http({ url: "../api/runQuery", method: "GET", params: input}
				).then(
					function (response) {
						if (response.data.err) {
							$scope.showStatus($scope.STATUS.ERROR, response.data.err);
						} else {
							$scope.deliverResult(response.data.res);
						}
					},
					function (err) {
						alert(err);
					}
				);
		}	
			
		
		
		// $scope.abortQuery = function () {
		// 	if ($scope.currentRequest)	
		// 		$scope.currentRequest.abort();
		// 	$scope.showStatus($scope.STATUS.ERROR, "Request cancelled.");
			
		// }
		
		
	
		$scope.deliverResult = function(arr){
			
			var filename = $scope.data.collection.selected;
			var result = "";
			
			switch ($scope.data.format.selected){
				case "json":
					result = JSON.stringify(arr);
					filename = filename + ".json";
					break;
				case "csv":
					var lineSeparator = "\n";
					if ($scope.data.delivery.selected == "web"){
						lineSeparator = "<br>";
					} 
					result = exports.arrayToCSV(arr, lineSeparator);
					filename = filename + ".csv";
					break;
				case "html":
					var tableClass = "";
					if ($scope.data.delivery.selected == "web"){
						tableClass = "w3-table w3-bordered w3-striped";
					}
					result = exports.arrayToHTMLTable(arr, tableClass, exports.COL_LIMIT); 
					filename = filename + ".html";
					break;
			}
			
			if ($scope.data.delivery.selected == "web") {
				$scope.showStatus($scope.STATUS.SHOWING_RESULT, result);
			} else {
				exports.download(filename, result);
				$scope.showStatus($scope.STATUS.OPENING_FILE);
			}	
		}
	
		// scope data initializations
		$scope.data = {
			connectionString: exports.DEMO_DB,
			collection: {
					options: [],
					selected: '',
					progress: false
			},
			collError: '',
			query: exports.FIND_QUERY,
			
			format:{
				options: [
					{ key: "json", val: "JSON" },
					{ key: "csv", val: "CSV" },
					{ key: "html", val: "HTML (up to " + exports.COL_LIMIT + " cols)" }],
				selected: "json"
			},
			
			delivery:{
				options: [
					{ key: "web", val: "This web page" },
					{ key: "file", val: "File" }],
				selected: "web"
			},
			
			operation:{
				options: [
					{ key: "find", val: "Find", ref: "http://docs.mongodb.org/manual/reference/method/db.collection.find/"},
					{ key: "aggr", val: "Aggregate", ref: "http://docs.mongodb.org/manual/reference/method/db.collection.aggregate/" }],
				selected: "find"
			},
			
			resultHeader: "Result (top " + exports.ROW_LIMIT + " documents)",
			
			result: {
				error: "",
				data: "",
				progress: false
			}
		};
		
		$scope.refreshCollections(); 

  }]);
    
})(window.angular);