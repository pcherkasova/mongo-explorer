"use strict";

var hashing = require("./../../app/framework/hashing.fw.js");
var should = require("should"); 
var Q = require("q");

exports.tests = [];
exports.tests.push(simplyHashing);


function simplyHashing() {
	
	return Q.Promise(function (resolve, reject, notify) {
		var h1 = hashing.hashString("hello, ");
		var h2 = hashing.hashString("hello, ");
		var h3 = hashing.hashString("Polina");
		should(h1).be.equal(h2);
		should(h1).not.be.equal(h3);
		
		console.log("---- test passed: hash.simplyHashing ---------------------------");
		resolve();
	});
	
	
	
}