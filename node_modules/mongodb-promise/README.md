mongodb-promise
---------------

[![Build Status](https://travis-ci.org/jbong/mongodb-promise.svg?branch=master)](https://travis-ci.org/jbong/mongodb-promise)

Mongodb-promise is a light promise wrapper around [node-mongodb-native](https://github.com/mongodb/node-mongodb-native).


## Quick Examples

```js
var mp = require('mongodb-promise');

// Obtaining a connection
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test").then(function(db){
    db.close().then(console.log('success'));
}, function(err) {
    console.log(err);
});

// Read Db stats
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
.then(function(db){
    return db.stats().then(function(stats) {
        console.log(stats);
        db.close().then(console.log('success'));
    })
})
.fail(function(err) {console.log(err)});

// Insert documents
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
    .then(function(db){
        return db.collection('test')
            .then(function(col) {
                return col.insert([{a : 1}, {a : 2}])
                    .then(function(result) {
                        console.log(result);
                        db.close().then(console.log('success'));
                    })
            })
})
.fail(function(err) {console.log(err);});

// Read all documents
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
    .then(function(db){
            return db.collection('test')
                .then(function(col) {
                    return col.find({a : 1}).toArray()
                        .then(function(items) {
                            console.log(items);
                            db.close().then(console.log('success'));
                        })
            })
})
.fail(function(err) {console.log(err)});

// Read each document
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
    .then(function(db){
        return db.collection('test')
            .then(function(col) {
                return col.find({a : 1}).each(function(doc) {
                    console.log(doc);
                })
                .then(function() {
                    db.close().then(console.log('success'));
                })
        })
})
.fail(function(err) {console.log(err);});

```
## Download

    npm install mongodb-promise

## Test

    make test