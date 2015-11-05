"use strict";

/// we want this module to be available both in browser client and nodejs server
if (typeof Window != "undefined")
	var exports = this.$errors = {};


// we do not want the error to contain callstack, because it is available on client side
exports.AppError = function (code, details) {
	this.details = details;
	this.code = code;
};

exports.AppError.prototype.toString = function() {
	var res = "Error code not found - " + this.code +"."
	for (var i in exports.ERR)
		for (var j in exports.ERR[i]) {
			if (exports.ERR[i][j] == this.code) {
					res = i + "." + j;				
			}
		}
		
	if (this.details) {
		res += "." + this.details;
	}
	
	return res;
}

exports.ERR = {
	
	NO_ERROR: 0,
	CLIENT_UNEXPECTED: 1,
	
	MONGO: {
		UNEXPECTED: 10,
		CONN_EMPTY:11, // client side only
		CONN_FORMAT: 12,
		CONN_TIMED_OUT: 13, // not covered by testing
		CONN_NO_SERVER: 14,
		CONN_AUTH: 15,
		EMPTY_COLLECTION: 16,
		QUERY_EMPTY: 17, // client side only
		QUERY_FORMAT: 18,
		QUERY_EXECUTION: 19
	}
}

