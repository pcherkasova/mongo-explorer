// https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku

var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


require('./app/server.routes.js')(app); 

app.listen(port, function() {
	console.log('The app is running on http://localhost:' + port);
});