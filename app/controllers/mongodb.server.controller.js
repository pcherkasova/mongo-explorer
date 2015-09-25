var http = require('http');
var helpers = require('./../../public/js/helpers.js');
var structures = require('./../../public/js/structures.js');
var MongoClient = require('mongodb').MongoClient;
var Q = require("q");
var should = require('should');

// returns HTML result
exports.runQueryHTML = function (req, res, next) {
    var input = req.query;
    var output = { err: null, res: null };
    console.log("runQueryHTML");
    
    return runQuery(input.conn, input.coll, input.operation, input.q, structures.ROW_LIMIT
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
            output.err = { operational: true, errType: "Unexpected error." , details: ""}; 
            console.log("Programming error: " + err.name)
            throw err;
        }
    }).finally(function () {
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
    var input = req.query;
    var output = { err: null, res: null };
    console.log("getCollections");
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
            output.err = { operational: true, errType: "Unexpected error." , details: ""}; 
            console.log("Unexpected programming error: " + err.name + ": " + err.message);
            throw err;
        }        
    }).finally(function () {
        if (db) db.close();
        res.json(output);
    });
}