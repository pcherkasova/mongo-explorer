"use strict";

var Q = require("q");
var should = require("should"); // https://github.com/shouldjs/should.js
var controller = require("./app/controllers/query.ctrl.js");
var constants = require("./public/app/shared/constants.js");
var errors = require("./public/app/shared/errors.js");

var DEMO_DB = constants.DEMO_DB;
var TEST_DB = process.env.APP_TEST_DB;
var COLL_NAME = "us-zip-codes";
var req, res;

var badFunction = function (resolve, reject, notify) {
    console.log('bad function');
}

var q = Q.Promise(badFunction)
.then(function (output) {
    console.log('bad function returned: ' + output);
}).catch(function (err) {
    console.log('catch');
    throw err;
}).done();

console.log(q);


	// function testPromise() {
	// 	return Q.Promise(function (resolve, reject, notify) {
	// 		console.log('run query ...');
	// 		req = { query: { conn: DEMO_DB, coll: COLL_NAME, operation: "find", q: constants.queryExamples[0].query }, session: { id:'test', user_type: 'development' }  };
	// 		res = { json: resolve };
	// 		controller.runQueryHTTP(req, res, undefined);
	// 		return Q();
	// 	}).then(function (output) {
	// 		console.log('after run query ...');		
	// 		should(output).have.property('err', null);
	// 		should(output).have.property('res');
	// 		console.log("test passed");
	// 		return true;
	// 	});
	// }

	// Q(testPromise()).then(function () {
	// 	console.log("Testing complete.");
	// }).catch(function (err) {
	// 	throw err;
	// }).done();


// var should = require("should"); // https://github.com/shouldjs/should.js
// var controller = require("./app/controllers/query.ctrl.js");
// var Q = require("q");
// var constants = require("./public/app/shared/constants.js");
// var errors = require("./public/app/shared/errors.js");

// var CONN_STRING = process.env.APP_TEST_DB;

// var COLL_NAME = "us-zip-codes";
// var req, res;

// var q = Q.Promise(function (resolve, reject, notify) {
// 	    console.log(0);
//       	req = { 
// 			query: { 
// 				conn: CONN_STRING, 
// 				queries: [{name: 'query1', code: 'q1 code'}, {name: 'query2', code: 'q2 code'}, {name: 'query3', code: 'q3 code'}]
// 			}, 
// 			session: { 
// 				id:'test', 
// 				user_type: 'development' 
// 			}  
// 		};
// 		res = { json: resolve }
// 		console.log(11);
// 		controller.saveQueriesHTTP(req, res, undefined);
// 		console.log(12);
// 	}).then(function (output) {
//         console.log(1);
// 		should(output).have.property('err', null);
// 		should(output.res).have.property('ok', 1);
// 		should(output.res).have.property('n', 3);
// 		console.log("---- test passed: explorer.saveQueriesHTTP ---------------------------");
		
// 	});

// console.log(777);
// Q.all(q).then(function (values) {
// 	console.log(values.length + " tests passed.");
// }).catch(function (err) {
// 	throw err;
// }).done();




