"use strict";

var Q = require("q");

var tests = []
    .concat(require("./tools/test/test.query.js").tests)
    // .concat(require("./tools/test/test.logging.js").tests)
    // .concat(require("./tools/test/test.hash.js").tests)
	;

for (var i in tests) {
	tests[i] = tests[i]();
}

var q = Q.all(tests	
 ).then(function (values) {
	console.log(values.length + " tests passed.");
}).fail(function (err) {
	throw err;
}).done();

console.log(q.inspect().state);
