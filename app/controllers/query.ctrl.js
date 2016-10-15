"use strict";

var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var Q = require("q");
var should = require('should');

var helpers   = require('./../../public/app/shared/helpers.js');
var constants = require('./../../public/app/shared/constants.js');
var errors    = require('./../../public/app/shared/errors.js');
var logging   = require('./../../app/core/logging.core.js');
var hashing   = require('./../../app/framework/hashing.fw.js');
var dbOperations   = require('./../../app/framework/db_operations.fw.js');


// Returns HTTP result.
exports.runQueryHTTP = function (req, res, next) {
    var start = new Date().getTime();

    var input = req.query;
    var output = { err: null, res: null };
    var q;
    
    Q.try(function () {
        try {
            q = JSON.parse(input.q);
        } catch (err) {
            throw new errors.AppError(errors.ERR.MONGO.QUERY_FORMAT);
        }
    }).then(function () {
        return runQuery(input.conn, input.coll, input.operation, q, constants.ROW_LIMIT);
    }).then(function (arr) {
        output.res = arr;   
    }).catch(function (err) {
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        input.conn = hashConnString(input.conn);  // we do not want to store connection string
        var example = -1;
        for (var i in constants.queryExamples)
            if (constants.queryExamples[i].query === input.q)
                {
                    example = i;
                    break;
                }
        logging.logTrace(req.session, "run-query", 
            { 
                duration: new Date().getTime() - start, 
                input: input, 
                res: output.res? output.res.
                length: undefined, 
                err: output.err,
                example:  example});
        res.json(output);
    }).done();
}

exports.processMongoError = function (err, session) {
    var res = new errors.AppError(errors.ERR.MONGO.UNEXPECTED);
    if (err instanceof errors.AppError){
        res = err;
    } else if (err.name == "MongoError" && (err.message.contains('getaddrinfo ENOTFOUND') || err.message.contains('ECONNREFUSED'))) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_NO_SERVER);    
    } else if (err.name == "MongoError" && err.message.contains('timed out')) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_TIMED_OUT);    
    } else if (err.name == "MongoError" && err.message.contains('Authentication failed')) {
        res = new errors.AppError(errors.ERR.MONGO.CONN_AUTH);
    } else if (err.toString().contains("URL must be in the format mongodb")){
        res = new errors.AppError(errors.ERR.MONGO.CONN_FORMAT);
    } else if (err.name == "TypeError" && err.message.contains('Cannot assign to read only property')) {
        res = new errors.AppError(errors.ERR.MONGO.NO_WRITE_PERMISSIONS, err.message);
    } else if (err.name == "MongoError") {
        res = new errors.AppError(errors.ERR.MONGO.QUERY_EXECUTION, err.message);
    } else {
        res = new errors.AppError(errors.ERR.MONGO.UNEXPECTED); 
        logging.logError(session, err);
    }
    return res;
}

var getCollections = function(connectionString) {
    var db;
    var colls;
    return Q.try(function() { 
        return MongoClient.connect(connectionString)
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
        var res = [];
        for (var i in colls) {
            res.push({ name: colls[i].name, count: values[i] })
        }
        return res;
    }).catch(function (err) {    
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        if (db) db.close();
    });    
}

// Returns promise with array.
var runQuery = function(connectionString, collName, operation, query, rowLimit) {
    var db;
    return Q.try(function () { 
        if (!collName) {
            throw new errors.AppError(errors.ERR.MONGO.EMPTY_COLLECTION);
        }
        should(connectionString).instanceof(String);
        should(operation).instanceof(String);
        should(query).instanceof(Object);
        
        return MongoClient.connect(connectionString);
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

var hashConnString = function(connString){
    if (connString === constants.DEMO_DB)
        return "demo";
    if (connString === process.env.APP_TELEMETRY_DB)
        return "logs";
    if (connString === process.env.APP_TEST_DB)
        return "test";    
        
    return hashing.hashString(connString);
}

exports.connectHTTP = function (req, res, next) {
    var start = new Date().getTime();
    
    var input = req.query;
    var output = { err: null, res: null };

    Q.all([
        getCollections(input.conn), 
        runQuery(input.conn, 'mongo-explorer.com', 'find', {}, 100)
    ]).then(function (values) {  
        output.res = {
            collections: values[0],
            queries: values[1]
        };      
        return true;
    }).catch(function (err) { 
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        input.conn = hashConnString(input.conn); // We do not store plain connection string.
        logging.logTrace(req.session, "connect", { duration: new Date().getTime() - start, input: input, res: output.res? output.res.length : undefined, err: output.err });
        res.json(output);
    }).done(); 
}

exports.saveQueriesHTTP = function (req, res, next) {
    var start = new Date().getTime();
    
    var input = req.query;
    var output = { err: null, res: null };

    var queries = JSON.parse(input.queries);
    
    return dbOperations.clearAndInsertMany(input.conn, 'mongo-explorer.com', queries)
    .then(function (res) {
        output.res = res.result.ok ? true : false;
        console.log('res:' + JSON.stringify(res, null, 4));
    }).catch(function (err) {   
        console.log(err); 
        output.err = exports.processMongoError(err, req.session.id);
        if (output.err.code == errors.ERR.MONGO.UNEXPECTED) 
            throw err;
    }).finally(function () {
        console.log('output:' + JSON.stringify(output, null, 4));
        input.conn = hashConnString(input.conn); // We do not store plain connection string.
        logging.logTrace(req.session, "connect", { duration: new Date().getTime() - start, input: input, res: output.res? output.res.length : undefined, err: output.err });
        res.json(output);
    }).done(); 
}