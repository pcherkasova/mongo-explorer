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
		res += ". " + this.details;
	}
	
	return res;
}

exports.ERR = {
	
    NO_ERROR: 'NO_ERROR',
	CLIENT_UNEXPECTED: 'CLIENT_UNEXPECTED',
	SERVER_UNEXPECTED: 'SERVER_UNEXPECTED',
	
	MONGO: {
		UNEXPECTED: 'MONGO_UNEXPECTED',
		CONN_EMPTY: 'CONN_EMPTY',
		CONN_FORMAT: 'CONN_FORMAT',
		CONN_TIMED_OUT: 'CONN_TIMED_OUT',
		CONN_NO_SERVER: 'CONN_NO_SERVER',
		CONN_AUTH: 'CONN_AUTH',
		EMPTY_COLLECTION: 'EMPTY_COLLECTION',
		QUERY_EMPTY: 'QUERY_EMPTY',
		QUERY_FORMAT: 'QUERY_FORMAT',
		QUERY_EXECUTION: 'QUERY_EXECUTION',
		NO_WRITE_PERMISSIONS: 'NO_WRITE_PERMISSIONS'
	}
}

