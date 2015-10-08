"use strict";

var should = require("should"); // https://github.com/shouldjs/should.js
var controller = require("./../../app/controllers/explorer.ctrl.js");
var Q = require("q");
var model = require("./../../public/app/shared/constants.js");


var CONN_STRING = model.DEMO_DB;
var COLL_NAME = "us-zip-codes";
var req, res;

exports.tests = [];
exports.tests.push(getCollections);
exports.tests.push(getCollectionsWrongConnection);
exports.tests.push(getCollectionsWrongConnectionFormat);
exports.tests.push(runQueryFind);
exports.tests.push(runQueryAggr);
exports.tests.push(runQueryWrongConnection);
exports.tests.push(runQueryWrongConnectionFormat);
exports.tests.push(runQueryWrongCollection);
exports.tests.push(runQueryEmpty);
exports.tests.push(runQueryWrongJSON);
exports.tests.push(runQueryWrongQuery);


function getCollections() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING }, session: { user_type: 'development' } };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res[0].name).be.instanceof(String);
		console.log("---- test passed: explorer.getCollections ---------------------------");
		return true;
	});
}

function getCollectionsWrongConnection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "mongodb://ha:ha@ds037283.mongolab.com:37283/mongo-explorer-test" }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Mongo error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: explorer.getCollectionsWrongConnection ---------------------------");
		return true;
	});
}

function getCollectionsWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha" }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output.err.errType).startWith("Connection string format error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: explorer.getCollectionsWrongConnectionFormat ---------------------------");
		return true;
	});
}


function runQueryFind() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: model.FIND_QUERY }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(model.ROW_LIMIT);
		console.log("---- test passed: explorer.runQueryFind ---------------------------");
		return true;
	});
}

function runQueryAggr() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "aggr", q: model.AGGREGATE_QUERY }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(4);
		console.log("---- test passed: explorer.runQueryAggr ---------------------------");
		return true;
	});
}


function runQueryWrongConnection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "mongodb://ha:ha@ds037283.mongolab.com:37283/mongo-explorer-test", coll: COLL_NAME, operation: "aggr", q: model.AGGREGATE_QUERY }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Query execution error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: explorer.runQueryWrongConnection ---------------------------");
		return true;
	});
}

function runQueryWrongCollection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: "hahaha", operation: "aggr", q: model.AGGREGATE_QUERY }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res', []);
		console.log("---- test passed: explorer.runQueryWrongConnection ---------------------------");
		return true;
	});
}

function runQueryWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha", coll: COLL_NAME, operation: "aggr", q: model.AGGREGATE_QUERY }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output.err.errType).startWith("Connection string format error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: explorer.runQueryWrongConnectionFormat ---------------------------");
		return true;
	});
}



function runQueryEmpty() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "" }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.details).startWith("SyntaxError:");
		console.log("---- test passed: explorer.runQueryEmptyQuery ---------------------------");
		return true;
	});
}

function runQueryWrongJSON() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "ha ha" }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.details).startWith("SyntaxError:");
		console.log("---- test passed: explorer.runQueryWrongJSON -------------------------------");
		return true;
	});
}

function runQueryWrongQuery() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: '{ "query": { "$haha": 25 } }' }, session: { user_type: 'development' }  };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Query execution error.");
		console.log("---- test passed: explorer.runQueryWrongQuery -------------------------------");
		return true;
	});
}

