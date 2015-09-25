var Q = require('q');

var Cursor = function(internal) {
    this._cursor = internal;
};
/**
 * Returns an array of documents
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.toArray = function() {
    var deferred = Q.defer();
    this._cursor.toArray(function(err, documents) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(documents);
        }
    });
    return deferred.promise;
};
/**
 * Iterates over all the documents for this cursor
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.each = function(fn) {
    var deferred = Q.defer();
    var self = this;

    var loop = function() {
        self._cursor.each(function(err, document) {
            if(err) {
                deferred.reject(err);
            } else {
                if(!document) {
                    return deferred.resolve();
                } else {
                    Q.when(fn(document),loop, deferred.reject);
                }
            }
        });
    };

    Q.nextTick(loop);
    return deferred.promise;
};
/**
 * Determines how many result the query for this cursor will return
 * @param {boolean} applySkipLimit
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.count = function(applySkipLimit) {
    var deferred = Q.defer();
    this._cursor.count(applySkipLimit || false, function(err, count) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(count);
        }
    });
    return deferred.promise;
};
/**
 * Sets the sort parameter of this cursor to the given value.
 * @param keyOrList
 * @param direction
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.sort = function(keyOrList, direction) {
    this._cursor.sort(keyOrList, direction);
    return this;
};
/**
 * Sets the limit parameter of this cursor to the given value.
 * @param limit
 * @returns {Cursor}
 */
Cursor.prototype.limit = function(limit) {
    this._cursor.limit(limit);
    return this;
};
/**
 * Specifies a time limit for a query operation
 * @param maxTimeMS
 * @returns {Cursor}
 */
Cursor.prototype.maxTimeMS = function(maxTimeMS) {
    this._cursor.maxTimeMS(maxTimeMS);
    return this;
};
/**
 * Sets the read preference for the cursor
 * @param {string} pref
 * @returns {Cursor}
 */
Cursor.prototype.setReadPreference = function(pref) {
    this._cursor.setReadPreference(pref);
    return this;
};
/**
 * Sets the skip parameter of this cursor to the given value.
 * @param pref
 * @returns {Cursor}
 */
Cursor.prototype.skip = function(pref) {
    this._cursor.setReadPreference(pref);
    return this;
};
/**
 * Gets the next document from the cursor.
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.nextObject = function() {
    var deferred = Q.defer();
    this._cursor.nextObject(function(err, document) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(document);
        }
    });
    return deferred.promise;
};
/**
 * Gets a detailed information about how the query is performed on this cursor and how long it took the database to process it.
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.explain = function() {
    var deferred = Q.defer();
    this._cursor.explain(function(err, explaination) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(explaination);
        }
    });
    return deferred.promise;
};
/**
 * Close the cursor
 * @returns {promise|*|Q.promise}
 */
Cursor.prototype.close = function() {
    var deferred = Q.defer();
    this._cursor.close(function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

/**
 * Check if the cursor is closed or open.
 * @param pref
 * @returns {Cursor}
 */
Cursor.prototype.isClosed = function(pref) {
    return this._cursor.isClosed();
};

exports.Cursor = Cursor;