"use strict";

var Q = require("q");
var db_operations = require("./../../app/framework/db_operations.fw.js");
var telemetryConnection = process.env.APP_TELEMETRY_DB;
var collection = 'logs';



exports.logUserEvent = function (session, name, step, details) {
	var doc = {
		event_type: 'user_event',
		time: (new Date()).toISOString(),
		session: session,
		name: name,
		step: step,
		details: details
	};
	console.log("logUserEvent: " +  name);
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc		
	)
}

exports.logError = function (session, err, details) {
	var doc = {
		event_type: 'error',
		time: (new Date()).toISOString(),
		session: session,
		name: err.name,
		message: err.message,
		stack: (err.stack) ?  err.stack:  (new Error(err)).stack,
		details: details
	};
	console.log("logError: " + doc.stack);
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc
	)
}

exports.logTrace = function (session, name, details) {
	var doc = {
			event_type: 'trace',
			time: (new Date()).toISOString(),
			session: session,
			name: name,
			details: details
		};
	console.log("logTrace: " +  name);
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc
	)
}

