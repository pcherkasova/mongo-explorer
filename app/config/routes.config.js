"use strict"

var explorerController = require('../../app/controllers/explorer.controller.js'); 
var loggingController = require('../../app/controllers/logging.controller.js'); 

module.exports = function (app) {
	// UI calls
	app.get('/', function(req, res) {
		// ejs render automatically looks in the views folder
		res.render('index');
	});

	// API calls
    app.route('/api/runQuery').get(explorerController.runQueryHTML);
	app.route('/api/getCollections').get(explorerController.getCollectionsHTML);
	app.route('/api/logUserEvent').post(loggingController.logUserEventHTML);
	
	
};