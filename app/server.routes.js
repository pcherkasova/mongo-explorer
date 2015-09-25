var mongodbController = require('../app/controllers/mongodb.server.controller.js'); 

module.exports = function (app) {
	
	// UI calls
	app.get('/', function(req, res) {
		// ejs render automatically looks in the views folder
		res.render('index');
	});

	// API calls
    app.route('/api/runQuery').get(mongodbController.runQueryHTML);
	app.route('/api/getCollections').get(mongodbController.getCollectionsHTML);
};