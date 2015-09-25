var express        = require('express');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

module.exports = function () {
    var app = express();   
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());    
    app.use(methodOverride());
    app.use(express.static('./public'));    
    return app;
};

