"use strict";

/// we want this module to be available both in browser client and nodejs server
if (typeof Window != "undefined"){
	var exports = this.$constants = {};
	
}
	

//////////////////////
exports.DEMO_DB = "mongodb://auser:apassword@ds033103.mongolab.com:33103/mongo-explorer-demo"

exports.ROW_LIMIT = 1000;
exports.COL_LIMIT = 50;
	
exports.queryExamples = [
	{
		name: "Get all documents.",
		operation: "find",
		query: '{}'
	},
	{
		name: "Aggregate. Count zip codes by type.",
		operation: "aggr",
		query: '[\n' +
		'    {"$match": { } },\n' +
		'    {"$group": { "_id": "$type", "count": { "$sum": 1 }}},\n' +
		'    {"$sort": { "count": -1 } }\n' +
		']\n'
	},
	{
		name: "Filter. List only standard zip codes.",
		operation: "find",
		query: '{\n' +
		'    "query": {"type": "STANDARD"}\n' +
		'}\n'
	},
	{
		name: "Project and sort. Order standard zip codes by population and show only important fields",
		operation: "find",
		query: '{\n' +
		'    "query": {"type": "STANDARD"},\n' +
		'    "projection":{"zip":1, "type":1, "state":1, "primary_city":1, "estimated_population":1},\n' +
		'    "sort" : {"estimated_population":-1}\n' +	
		'}\n'
	},
	{
		name: "Filter, aggregate and sort. Count zip codes by states.",
		operation: "aggr",
		query: '[\n' +
		'    {"$match": { "type": "STANDARD" } },\n' +
		'    {"$group": { "_id": "$state", "count": { "$sum": 1 }}},\n' +
		'    {"$sort": { "count": -1 } }\n' +
		']\n'
	},
	{
		name: "Filter, aggregate and sort. Averege population per zip by state.",
		operation: "aggr",
		query: '[\n' +
		'    {"$match": { "type": "STANDARD" } },\n' +
		'    {"$group": { "_id": "$state", "population-per-zip": { "$avg": "$estimated_population" }}},\n' +
		'    {"$sort": { "population-per-zip": -1 } }\n' +
		']\n'
	}
];
	

