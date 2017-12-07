'use strict';
const MongoClient = require('mongodb').MongoClient;
const User = require('./user');
const ObjectId = require('mongodb').ObjectID;

// Setup our db variable
var db;

exports.connectDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    var un = 'website';
    var pw = 'wd2fall';
    var url = `mongodb://${un}:${pw}@ds117316.mlab.com:17316/codeduel`;
    // Connect to the DB
    MongoClient.connect(url, (err, _db) => {
      if (err) return reject(err);
      db = _db;
      resolve(_db);
    });
  });  
};

exports.allUsers = () => {
    return exports.connectDB()
    .then((db) => {
        var collection = db.collection('users');
        return collection.find({}).toArray()
        .then((documents) => {
            return documents;
        });
    });
};

exports.create = (username, password) => {
  return exports.connectDB()
  .then((db) => {
      var user = new User(username, password);
      var collection = db.collection('users');
      return collection.insertOne(user)
        .then((result) => {return result;});
  });
};
