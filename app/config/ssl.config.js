

module.exports = function (app) {
    if (app.get('env') === 'production') 
        app.use(forceSsl);	
}

var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};
