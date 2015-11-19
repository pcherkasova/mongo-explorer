var session = require('client-sessions');
var helpers = require('./../../public/app/shared/helpers.js');
var logging = require("./../../app/core/logging.core.js");

module.exports = function (app) {
 
  
  app.use(session({
    cookieName: 'session',
    secret: app.get('session_secret'),
    duration: 30 * 24 * 60 * 60 * 1000,
    activeDuration: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
    //,ephemeral: true
  }));
  
  app.use(function (req, res, next) {
    if (!req.session.id){
      req.session.id = "s" + Math.round(Math.random() * 100000000);
      req.session.first_url = req.url;
      req.session.src = helpers.getURLParameter(req.url, "s");
      req.session.user_agent = req.headers["user-agent"];
      req.session.user_type = detectUserType(req.session.user_agent, req.url, app.get('env'), req.session.src);
      logging.logTrace(req.session, 'new-session');    
    }
    
    return next();
  });
}
  
function detectUserType(user_agent, path, environment, src) {
  var user_type = environment;
  
  if (src == 'test')
    user_type =  'test'; 
  
  var a = user_agent.toLowerCase();
  var p = path.toLowerCase();
  
  if (
    a.contains("+http")
    || a.contains("crawler")
    || a.contains("bot")
    || a.contains("msn")
    || a.contains("rambler")
    || a.contains("yahoo")
    || a.contains("google")
    || a.contains("spider")
    || a.contains("seek")
    || a.contains("accoona")
    || p.contains("robots-txt")
    || p.contains("xmlrpc-php")
    || p.contains("index-php")
    || p.contains("index - php")
    ) user_type = "crawler";  
      
  return user_type;
}

// https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/