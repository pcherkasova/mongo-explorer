var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};


var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
var env = process.env.NODE_ENV || 'development';
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

if (env === 'production') 
    app.use(forceSsl);

require('./app/server.routes.js')(app); 

app.listen(port, function() {
	console.log('The app is running on http://localhost:' + port);
});