var Q = require('q');
var MongoDB = require('mongodb');
var Db = require('./db').Db;

var MongoClient = function() {};

MongoClient.connect = function(uri, opt) {
    var deferred = Q.defer();

    MongoDB.MongoClient.connect(uri, opt, function(err, db) {
        if(err) {
            deferred.reject(err);
        } else {
            var mpDb = new Db();
            mpDb._db = db;
            deferred.resolve(mpDb);
        }
    });

    return deferred.promise;
};


exports.MongoClient = MongoClient;