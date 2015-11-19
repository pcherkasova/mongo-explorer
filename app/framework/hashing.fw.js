"use strict";

exports.hashString = function(input){
    return require('crypto').createHash('md5').update(input).digest("hex");

}
