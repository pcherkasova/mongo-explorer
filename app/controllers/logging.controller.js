var logging = require("../../app/core/logging.core.js");

exports.logUserEventHTML = function (req, res, next) {
    var input = req.query;
    logging.logUserEvent(req.session.id, input.name, input.step, input.details);
    res.send();
}