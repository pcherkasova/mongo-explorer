"use strict";

/// We want this module to be available both in browser client and nodejs server.
if (typeof Window != "undefined"){
	var exports = this.$constants = {};
}
	

//////////////////////
exports.DEMO_DB = "mongodb://auser:apassword@ds033103.mongolab.com:33103/mongo-explorer-demo"

exports.ROW_LIMIT = 1000;
exports.COL_LIMIT = 50;
	
