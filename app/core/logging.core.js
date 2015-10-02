"use strict";

var Q = require("q");
var db_operations = require("./../../app/framework/db_operations.fw.js");
var telemetryConnection = process.env.APP_TELEMETRY_DB;
var collection = 'logs';



exports.logUserEvent = function (session, name, step, details) {
	return db_operations.insert(
		telemetryConnection,
		collection,
		{
			event_type: 'user_event',
			time: (new Date()).toISOString(),
			session: session,
			name: name,
			step: step,
			details: details
		}
	)
}

exports.logError = function (session, err, details) {
	return db_operations.insert(
		telemetryConnection,
		collection,
		{
			event_type: 'error',
			time: (new Date()).toISOString(),
			session: session,
			name: err.name,
			message: err.message,
			details: details
		}
	)
}

exports.logTrace = function (session, name, details) {
	return db_operations.insert(
		telemetryConnection,
		collection,
		{
			event_type: 'trace',
			time: (new Date()).toISOString(),
			session: session,
			name: name,
			details: details
		}
	)
}