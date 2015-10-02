"use strict";

var test_explorer = require("./test.explorer.js"); 
var test_logging = require("./test.logging.js"); 
var Q = require("q");

var tests = [];
tests = tests.concat(test_explorer.tests);
tests = tests.concat(test_logging.tests);

for (var i in tests) {
	tests[i] = tests[i]();
}

Q.all(tests	
 ).then(function (values) {
	console.log(values.length + " tests passed.");
}).catch(function (err) {
	throw err;
}).done();

