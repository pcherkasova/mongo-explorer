"use strict"

var explorerController = require('../../app/controllers/query.ctrl.js'); 
var path = require('path');

module.exports = function (app) {
	
	// UI calls
	app.route('/').get(function(req, res) {
		res.sendFile('_index.html', { root: __dirname + '/../../public' });
	});
	
	
	// API calls
    app.route('/api/runQuery').get(explorerController.runQueryHTTP);
	app.route('/api/connect').get(explorerController.connectHTTP);
	app.route('/api/saveQueries').get(explorerController.saveQueriesHTTP);
	//app.route('/api/logUserEvent').post(loggingController.logUserEventHTTP);
	
	
};