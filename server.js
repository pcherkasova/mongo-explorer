

var express = require('express');
var app = express();

//source ~/.bash_profile
app.set('port', process.env.PORT || 8080);
app.set('env', process.env.NODE_ENV || 'development');
app.set('session_secret', process.env.APP_SESSION_SECRET );
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
require('./app/config/ssl.config.js')(app); 
require('./app/config/session.config.js')(app); 
require('./app/config/routes.config.js')(app);
 
app.listen(app.get('port'), function() {
	console.log('The app is running on http://localhost:' + app.get('port'));
});


