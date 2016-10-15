"use strict";

var Q = require("q");
var db_operations = require("./../../app/framework/db_operations.fw.js");
var telemetryConnection = process.env.APP_TELEMETRY_DB;
var collection = 'logs';

var version = require('./../../package.json').version;

function getDocTemplate(session, name, details, event_type){
	console.log(event_type + ": " +  name + ", " + session.id);
	return {
		version: version,
		event_type: event_type,
		name: name,
		session: session,
		time: (new Date()).toISOString(),
		details: details
	};
}

exports.logUserEvent = function (session, name, step, details) {
	var doc = getDocTemplate(session, name, details, 'user_event');
	doc.step = step;
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc		
	).done(); 
}

exports.logError = function (session, err, details) {
	var doc = getDocTemplate(session, err.name, err.message, 'error');
	doc.stack = (err.stack) ?  err.stack:  (new Error(err)).stack;
	// console.log(doc);
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc
	).done(); 
}

exports.logTrace = function (session, name, details) {
	var doc = getDocTemplate(session, name, details, 'trace');
	return db_operations.insert(
		telemetryConnection,
		collection,
		doc
	).done(); 
}

