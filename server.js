var express = require('express');
var app = express();

// https://code.visualstudio.com/Docs/runtimes/nodejs


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

require('./app/server.routes.js')(app); 

app.listen(app.get('port'), function() {
	console.log('mongo-explorer is running on port', app.get('port'));
});



