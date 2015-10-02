"use strict";

var MongoClient = require('mongodb').MongoClient;
var Q = require("q");

// returns promise
exports.insert = function (connection, collection, doc) {
	var db;
	return Q(MongoClient.connect(connection)
	).then(function (res) {
		db = res;
		return Q(db.collection(collection).insert(doc));
	}).finally(function () {
		if (db) {
			db.close();
		}
	});
}

exports.find = function (connection, collection, filter) {
	var db;
	return Q(MongoClient.connect(connection)
	).then(function (res) {
		db = res;
		return Q(db.collection(collection).find(filter).toArray());
	}).finally(function () {
		if (db) {
			db.close();
		}
	});
}