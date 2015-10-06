"use strict";

var should = require("should"); // https://github.com/shouldjs/should.js
var logging = require("./../../app/core/logging.core.js");
var Q = require("q");
var model = require("./../../public/app/core/constants.js");
var db_operations = require("./../../app/framework/db_operations.fw.js");

var CONN_STRING = process.env.APP_TELEMETRY_DB;
var collection = 'logs';

var session = {
	id: "s" + Math.round(Math.random() * 10000000).toString(),
	user_type: "development" 
}

exports.tests = [];
exports.tests.push(logUserEvent);
exports.tests.push(logError);
exports.tests.push(logTrace);

function logUserEvent() {
	return logging.logUserEvent(session, "name", "step", "details"
		).then(function () {
			return db_operations.find(
				CONN_STRING,
				collection,
				{ "session.id": session.id, event_type: "user_event" })
		}).then(function (arr) { 
			should(arr).be.instanceof(Array);
			should(arr.length).be.equal(1);
			should(arr[0]).have.property('session');
			should(arr[0].session.id).be.equal(session.id );
			should(arr[0].step).be.equal("step");
			should(arr[0].name).be.equal("name");
			should(arr[0].details).be.equal("details");
			console.log("---- test passed: logging.logUserEvent ---------------------------");
		});
}


function logError() {
	try {
		a.b();
	} catch (err) {
		return logging.logError(
			session,
			err
			).then(function () {
				return db_operations.find(
					CONN_STRING,
					collection,
					{ "session.id": session.id, event_type: "error"  })
			}).then(function (arr) { 
				should(arr).be.instanceof(Array);
				should(arr.length).be.equal(1);
				should(arr[0]).have.property('session');
				should(arr[0].session.id).be.equal(session.id );
				should(arr[0].name).be.equal("ReferenceError");
				should(arr[0].message).be.equal("a is not defined");
				console.log("---- test passed: logging.logError ---------------------------");
			});
	}
}

function logTrace() {
	return logging.logTrace(session, "name", "details"
		).then(function () {
			return db_operations.find(
				CONN_STRING,
				collection,
				{ "session.id": session.id, event_type: "trace"  })
		}).then(function (arr) { 
			should(arr).be.instanceof(Array);
			should(arr.length).be.equal(1);
			should(arr[0]).have.property('session');
			should(arr[0].session.id).be.equal(session.id );
			should(arr[0].name).be.equal("name");
			should(arr[0].details).be.equal("details");
			console.log("---- test passed: logging.logTrace ---------------------------");
		});
}
