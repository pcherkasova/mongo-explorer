var Q = require('q');
var Cursor = require('./cursor').Cursor;

/**
 * Create a new Collection instance (INTERNAL TYPE, do not instantiate directly)
 * @param db
 * @param collectionName
 * @constructor
 */
var Collection = function(internal){
    this._col = internal;
};
/**
 * Get all the collection statistics
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.stats = function(options) {
    var deferred = Q.defer();
    this._col.stats(options || {}, function(err, stats) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(stats);
        }
    });
    return deferred.promise;
};
/**
 * Inserts a single document or a an array of documents into MongoDB
 * @param {(Object|Object[])} docs
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.insert = function(docs, options) {
    var deferred = Q.defer();
    this._col.insert(docs, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Removes documents specified by selector
 * @param {Object} [selector]
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.remove = function(selector, options) {
    var deferred = Q.defer();
    this._col.remove(selector, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
Collection.prototype.delete = Collection.prototype.remove;
/**
 * Renames the collection
 * @param {string} newName
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.rename = function(newName, options) {
    var deferred = Q.defer();
    this._col.rename(newName, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(new Collection(result));
        }
    });
    return deferred.promise;
};
/**
 * Save a document
 * @param {Object} doc
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.save = function(doc, options) {
    var deferred = Q.defer();
    this._col.save(doc, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Updates documents
 * @param {Object} selector
 * @param {Object} document
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.update = function(selector, document, options) {
    var deferred = Q.defer();
    this._col.update(selector, document, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * The distinct command returns returns a list of distinct values for the given key across a collection
 * @param {string} key
 * @param {Object} [query]
 * @param {Object} options
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.distinct = function(key, query, options) {
    var deferred = Q.defer();
    this._col.distinct(key, query || {}, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {

            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Count number of matching documents in the db to a query
 * @param query
 * @param options
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.count = function(query, options) {
    var deferred = Q.defer();
    this._col.count(query, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Drop the collection
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.drop = function() {
    var deferred = Q.defer();
    this._col.drop(function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Find and update a document.
 * @param {Object} query
 * @param {Array} sort
 * @param {Object} doc
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.findAndModify = function(query, sort, doc, options) {
    var deferred = Q.defer();
    this._col.findAndModify(query, sort, doc, options || {}, function(err, doc) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
};
/**
 * Finds a single document based on the query
 * @param {Object} query
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.findOne = function(query, options) {
    var deferred = Q.defer();
    this._col.findOne(query, options || {}, function(err, doc) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
};
/**
 * Find and remove a document
 * @param {Object} query
 * @param {Array} sort
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.findAndRemove = function(query, sort, options) {
    var deferred = Q.defer();
    this._col.findAndModify(query, sort, options || {}, function(err, doc) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
};

/**
 * Creates a cursor for a query that can be used to iterate over results from MongoDB
 * @param {Object} query
 * @param {Array} sort
 * @param {Object} [options]
 * @returns {Cursor}
 */
Collection.prototype.find = function(query, sort, options) {
    var _cursor = this._col.find(query, sort, options);
    return new Cursor(_cursor);
};
/**
 * Creates an index on the collection.
 * @param {Object} fieldOrSpec
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.createIndex = function(fieldOrSpec, options) {
    var deferred = Q.defer();
    this._col.createIndex(fieldOrSpec, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Ensures that an index exists, if it does not it creates it
 * @param fieldOrSpec
 * @param options
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.ensureIndex = function(fieldOrSpec, options) {
    var deferred = Q.defer();
    this._col.ensureIndex(fieldOrSpec, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Retrieves this collections index info.
 * @param options
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.indexInformation = function(options) {
    var deferred = Q.defer();
    this._col.indexInformation(options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Drops an index from this collection
 * @param name
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.dropIndex = function(name) {
    var deferred = Q.defer();
    this._col.dropIndex(name, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Drops all indexes from this collection.
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.dropAllIndexes = function() {
    var deferred = Q.defer();
    this._col.dropAllIndexes(name, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Reindex all indexes on the collection
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.reIndex = function() {
    var deferred = Q.defer();
    this._col.reIndex(name, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Run Map Reduce across a collection
 * @param map
 * @param reduce
 * @param options
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.mapReduce = function(map, reduce, options) {
    var deferred = Q.defer();
    this._col.mapReduce(map, reduce, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            if(options && options.out && (options.out.inline == 1)) {
                deferred.resolve(result);
            } else {
                deferred.resolve(new Collection(result));
            }
        }
    });
    return deferred.promise;
};


exports.Collection = Collection;