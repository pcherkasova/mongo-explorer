// var explorer = require('../app/controllers/explorer.server.controller.js'); 

module.exports = function (app) {
	
	app.get('/', function(req, res) {
		// ejs render automatically looks in the views folder
		res.render('index');
	});


	// //API calls
    // app.route('/api/runQuery').get(explorer.runQueryHTML);
	// app.route('/api/getCollections').get(explorer.getCollectionsHTML);

    // //UI calls
	// app.get('/', function (request, response) {
	// 	response.sendFile(__dirname + '/views/mongo-explorer.html');
	// 	//response.send('Hello World!');
	// });
};