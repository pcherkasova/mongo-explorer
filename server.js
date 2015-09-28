var forceSsl = function (req, res, next) {
    // console.log(JSON.stringify(req.path));
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


if (env === 'production') 
    app.use(forceSsl);
app.use(express.static(__dirname + '/public'));

require('./app/server.routes.js')(app); 

console.log("telemetry: " + process.env.APP_TELEMETRY_DB);
console.log("data: " + process.env.APP_DATA_DB);

app.listen(port, function() {
	console.log('The app is running on http://localhost:' + port);
});