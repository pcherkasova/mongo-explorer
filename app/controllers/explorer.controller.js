var http = require('http');
var helpers = require('./../../public/app/core/helpers.js');
var structures = require('./../../public/app/core/constants.js');
var MongoClient = require('mongodb').MongoClient;
var Q = require("q");
var should = require('should');
var logging = require("../../app/core/logging.core.js");

// returns HTML result
exports.runQueryHTML = function (req, res, next) {
    var id = Math.round(Math.random() * 100000000);
    var input = req.query;
    var output = { err: null, res: null };
    logging.logTrace(req.session, "runQueryHTML called", { coll: input.coll, operation: input.operation, query: input.q, id: id});
    
    runQuery(input.conn, input.coll, input.operation, input.q, structures.ROW_LIMIT
    ).then(function (arr) {
        output.res = arr;   
    }).catch(function (err) {
        if (err.operational){
            output.err = err;
        } else if (err.name == "MongoError") {
            output.err = { operational: true, errType: "Query execution error." , details: err.message};
        } else if (err.toString().contains("URL must be in the format mongodb")){
            output.err = { operational: true, errType: "Connection string format error." , details: err.message};
        }
        else {
            output.err = { operational: true, errType: "Unexpected error.", details: "" }; 
            logging.logError(req.session.id, err);
            throw err;
        }
    }).finally(function () {
        if (output.err) {
            logging.logTrace(req.session, "runQueryHTML failure", { id: id, err: output.err });
        } else if(output.res) {
            logging.logTrace(req.session, "runQueryHTML success", { id: id, res: output.res.length });
        } else {
            should.fail("output is not initialized");
        }
        
        res.json(output);
    }).done();
}

// returns promise with array
var runQuery = function (connection, collName, operation, query, rowLimit) {
    should(connection).instanceof(String);
    should(collName).instanceof(String);
    should(operation).instanceof(String);
    should(query).instanceof(String);
    
    var db;
    
    return Q.try(function () { 
        return MongoClient.connect(connection);
    }).then(function (connectedDB) {
        db = connectedDB;
        
        var collection = db.collection(collName);
        try {
            var q = JSON.parse(query);
        } catch (err) {
            throw { operational: true, errType: "Query parsing error.", details: err.toString() }; 
        }
        

        var cursor;
        switch (operation) {
            case "find":
                if (!q.query) q.query = {};
                if (!q.projection) ;
                if (!q.sort) q.sort = {};
                cursor = collection.find(q.query, q.projection).sort(q.sort).limit(rowLimit);
                break;
            case "aggr": cursor = collection.aggregate(q).limit(rowLimit); break;
            default: throw { operational: true, errType: "Unexpected value of operation.", details: operation }; 
        }
        return Q(cursor.toArray());
    }).finally(function () {
        if (db) db.close();
    });
}

exports.getCollectionsHTML = function (req, res, next) {
    var id = Math.round(Math.random() * 100000000);

    var input = req.query;
    var output = { err: null, res: null };
    logging.logTrace(req.session, "getCollectionsHTML called"), { id: id };
    
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
        if (err.operational){
            output.err = err;
        } else if (err.toString().contains("URL must be in the format mongodb")){
            output.err = { operational: true, errType: "Connection string format error." , details: err.message};
        } else if (err.name == "MongoError") {
            output.err = { operational: true, errType: "Mongo error.", details: err.message };
        } else {
            output.err = { operational: true, errType: "Unexpected error.", details: "" }; 
            logging.logError(req.session, err);
            throw err;
        }        
    }).finally(function () {
        if (db) db.close();
        if (output.err) {
            logging.logTrace(req.session, "getCollectionsHTML failure", { id: id, err: output.err });
        } else if(output.res) {
            logging.logTrace(req.session, "getCollectionsHTML success", { id: id, res: output.res.length });
        } else {
            logging.logError(req.session, "output is not initialized")
            should.fail("output is not initialized");
        }
        
        res.json(output);
    });
}