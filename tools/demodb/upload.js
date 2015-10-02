"use strict";

var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var helpers = require('./../../public/js/helpers.js');
var parse = require('csv-parse');
var Q = require("q");

var connectionString = process.env.DEMO_DB;
// source ~/.bash_profile

var db = null;

Q.all([
	loadDocs(),
	MongoClient.connect(connectionString)
]).then(function (res) {
	var docs = res[0];
	db = res[1];
	var collection = db.collection("us-zip-codes");
	console.log("collection found");
	return collection.insertMany(docs);
}).then(function (res) {
	console.log("Inserted: " + res.insertedCount);
}).fail(function (err) {
	console.log("Error: " + err);
}).finally(function () {
	if (db) {
		db.close();
		console.log("Connection closed");
	}
	console.log("Finish");
}).done();
	
	


function loadDocs() {
    return Q.Promise(function (resolve, reject, notify) {
		var count = -1; //we will not take first line with headers
		var result = [];
		var input = fs.readFileSync('zip_code_database.csv').toString();

		parse(input, {}, function (err, objects) {
			if (err) {
				reject(err);
			} else for (var i in objects) {
				count++;
				if (count == 0) continue;

				var obj = objects[i];
				var doc = {};

				doc["zip"] = obj[0].addLeadingZeros(5);
				doc["type"] = obj[1];

				doc["primary_city"] = obj[2];
				if (obj[3].length > 0)
					doc["acceptable_cities"] = obj[3].split(",");
				if (obj[4].length > 0)
					doc["unacceptable_cities"] = obj[4].split(",");
				doc["state"] = obj[5];
				if (obj[6].length > 0)
					doc["county"] = obj[6];
				doc["timezone"] = obj[7];
				if (obj[8].length > 0)
					doc["area_codes"] = obj[8].split(",");

				if (obj[9] * obj[10])
					doc["geo"] = { latitude: Number(obj[9]), longitude: Number(obj[10]) };

				doc["world_region"] = obj[11];
				doc["country"] = obj[12];
				doc["decommissioned"] = Number(obj[13]);
				if (obj[14] != "0")
					doc["estimated_population"] = Number(obj[14]);
				if (obj[15])
					doc["notes"] = obj[15];
				result.push(doc);
				notify(count / objects.length - 1);
			};
			console.log("documents loaded");
			resolve(result);
		});
	});
};		

