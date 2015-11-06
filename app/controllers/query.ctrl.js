var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var Q = require("q");
var should = require('should');

var helpers = require('./../../public/app/shared/helpers.js');
var constants = require('./../../public/app/shared/constants.js');
var errors = require('./../../public/app/shared/errors.js');
var logging = require("../../app/core/logging.core.js");

// returns HTTP result
exports.runQueryHTTP = function (req, res, next) {
    var start = new Date().getTime();

    var input = req.query;
    var output = { err: null, res: null };
    
    runQuery(input.conn, input.coll, input.operation, JSON.parse(input.q), constants.ROW_LIMIT
    ).then(function (arr) {
        output.res = arr;   
    }).catch(function (err) {
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        input.conn = undefined; // we do not want to store connection string
        logging.logTrace(req.session, "runQueryHTTP", { duration: new Date().getTime() - start, input: input, res: output.res? output.res.length: undefined, err: output.err });
        res.json(output);
    }).done();
}

exports.processMongoError = function (err, session) {
    var res = new errors.AppError(errors.ERR.MONGO.UNEXPECTED);
    if (err instanceof errors.AppError){
        res = err;
    } else if (err.name == "MongoError" && err.message.contains('getaddrinfo ENOTFOUND')) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_NO_SERVER);    
    } else if (err.name == "MongoError" && err.message.contains('timed out')) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_TIMED_OUT);    
    } else if (err.name == "MongoError" && err.message.contains('Authentication failed')) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_AUTH);
    } else if (err.toString().contains("URL must be in the format mongodb")){
        res = new errors.AppError(errors.ERR.MONGO.CONN_FORMAT);
    } else if (err.name == "MongoError") {
        res = new errors.AppError(errors.ERR.MONGO.QUERY_EXECUTION, err.message);
    }
    else {
        res = new errors.AppError(errors.ERR.MONGO.UNEXPECTED); 
        logging.logError(session, err);
    }
    return res;
}



// returns promise with array
var runQuery = function (connection, collName, operation, query, rowLimit) {
    
    var db;
    return Q.try(function () { 
        if (!collName) {
            throw new errors.AppError(errors.ERR.MONGO.EMPTY_COLLECTION);
        }
        should(connection).instanceof(String);
        should(operation).instanceof(String);
        should(query).instanceof(Object);
        
        return MongoClient.connect(connection);
    }).then(function (connectedDB) {
        db = connectedDB;
        var collection = db.collection(collName);
        
        var cursor;
        switch (operation) {
            case "find":
                if (!query.query) query.query = {};
                if (!query.projection) ;
                if (!query.sort) query.sort = {};
                cursor = collection.find(query.query, query.projection).sort(query.sort).limit(rowLimit);
                break;
            case "aggr":
                cursor = collection.aggregate(query).limit(rowLimit);
                break;
            default: throw new errors.AppError(errors.ERR.MONGO.UNEXPECTED, "Unexpected value of operation: " + operation);
        }
        return Q(cursor.toArray());
    }).finally(function () {
        if (db) db.close();
    });
}


// returns array of collection names and count of documents
exports.getCollectionsHTTP = function (req, res, next) {
    var start = new Date().getTime();
    
    var input = req.query;
    var output = { err: null, res: null };
    
    var db;
    var colls;
    
    Q.try(function () { 
        return MongoClient.connect(input.conn)
    }).then(function (connectedDB) {
        db = connectedDB;
        return Q(db.listCollections().toArray());
    }).then(function (collections) { 
        colls = collections;
        var countPromises = [];
        for (var i in collections) {
            countPromises.push(db.collection(collections[i].name).count());
        }
        return Q.all(countPromises);
    }).then(function (values) {      
        output.res = [];
        for (var i in colls) {
            output.res.push({ name: colls[i].name, count: values[i] })
        }
    }).catch(function (err) {    
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        if (db) db.close();
        input.conn = undefined; // we do not want to store connection string
        logging.logTrace(req.session, "getCollectionsHTTP", { duration: new Date().getTime() - start, input: input, res: output.res? output.res.length: undefined, err: output.err });
        res.json(output);
    });
}