"use strict"

var explorerController = require('../../app/controllers/query.ctrl.js'); 
var loggingController = require('../../app/controllers/logging.ctrl.js'); 

module.exports = function (app) {
	// UI calls
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});
	
	
	// API calls
    app.route('/api/runQuery').get(explorerController.runQueryHTTP);
	app.route('/api/getCollections').get(explorerController.getCollectionsHTTP);
	app.route('/api/logUserEvent').post(loggingController.logUserEventHTTP);
	
	
};