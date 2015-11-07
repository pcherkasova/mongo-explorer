"use strict";

var should = require("should"); // https://github.com/shouldjs/should.js
var controller = require("./../../app/controllers/query.ctrl.js");
var Q = require("q");
var constants = require("./../../public/app/shared/constants.js");
var errors = require("./../../public/app/shared/errors.js");

var CONN_STRING = constants.DEMO_DB;
var COLL_NAME = "us-zip-codes";
var req, res;

exports.tests = [];

//success:
exports.tests.push(getCollections);
exports.tests.push(runQueryFind);
exports.tests.push(runQueryAggr);
exports.tests.push(runQueryWrongCollection);

//errors:
exports.tests.push(getCollectionsNoServer);
exports.tests.push(getCollectionsWrongConnectionFormat);
exports.tests.push(runQueryEmptyCollection);
exports.tests.push(runQueryEmptyQuery);

exports.tests.push(runQueryAuthentication);
exports.tests.push(runQueryWrongConnectionFormat);
exports.tests.push(runQueryWrongJSON);
exports.tests.push(runQueryWrongQuery);



function getCollections() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING }, session: { id:'test', user_type: 'development' } };
		res = { json: resolve }
		controller.getCollectionsHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res[0].name).be.instanceof(String);
		console.log("---- test passed: explorer.getCollections ---------------------------");
		return true;
	});
}





function getCollectionsNoServer() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING.replace("mongolab.com", "haha.com")}, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.getCollectionsHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.CONN_NO_SERVER);
		console.log("---- test passed: explorer.getCollectionsWrongConnection ---------------------------");
		return true;
	});
}



function runQueryFind() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: constants.FIND_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(constants.ROW_LIMIT);
		console.log("---- test passed: explorer.runQueryFind ---------------------------");
		return true;
	});
}

function runQueryAggr() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "aggr", q: constants.AGGREGATE_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(4);
		console.log("---- test passed: explorer.runQueryAggr ---------------------------");
		return true;
	});
}


function runQueryWrongCollection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: "hahaha", operation: "aggr", q: constants.AGGREGATE_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res', []);
		console.log("---- test passed: explorer.runQueryWrongCollection ---------------------------");
		return true;
	});
}

function getCollectionsWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha" }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.getCollectionsHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.CONN_FORMAT);
		console.log("---- test passed: explorer.getCollectionsWrongConnectionFormat ---------------------------");
		return true;
	});
}



function runQueryAuthentication() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING.replace("auser:apassword", "ha:ha"), coll: COLL_NAME, operation: "aggr", q: constants.AGGREGATE_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.CONN_AUTH);
		console.log("---- test passed: explorer.runQueryAuthentication ---------------------------");
		return true;
	});
}



function runQueryEmptyCollection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: "", operation: "aggr", q: constants.AGGREGATE_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.EMPTY_COLLECTION);
		console.log("---- test passed: explorer.runQueryWrongConnection ---------------------------");
		return true;
	});
}

function runQueryWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha", coll: COLL_NAME, operation: "aggr", q: constants.AGGREGATE_QUERY }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.CONN_FORMAT);
		console.log("---- test passed: explorer.runQueryWrongConnectionFormat ---------------------------");
		return true;
	});
}



function runQueryEmptyQuery() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "" }, session: { id:'test',  user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.QUERY_FORMAT);
		console.log("---- test passed: explorer.runQueryEmptyQuery ---------------------------");
		return true;
	});
}

function runQueryWrongJSON() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "ha ha" }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.QUERY_FORMAT);
		console.log("---- test passed: explorer.runQueryWrongJSON -------------------------------");
		return true;
	});
}

function runQueryWrongQuery() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: '{ "query": { "$haha": 25 } }' }, session: { id:'test', user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTTP(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.code).equal(errors.ERR.MONGO.QUERY_EXECUTION);
		console.log("---- test passed: explorer.runQueryWrongQuery -------------------------------");
		return true;
	});
}

