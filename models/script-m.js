'use strict';
const MongoClient = require('mongodb').MongoClient;
const Script = require('./script');
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

exports.allScripts = () => {
    return exports.connectDB()
    .then((db) => {
        var collection = db.collection('scripts');
        return collection.find({}).toArray()
        .then((documents) => {
            return documents;
        });
    });
};

exports.getScriptInfo = (id) => {
  return exports.connectDB()
  .then((db) => {
     var collection = db.collection('scripts');
     if (!ObjectId.isValid(id)) {
       return false;
     }
     return collection.findOne({_id: new ObjectId(id)})
     .then((doc) => {
         if (doc == null) {
           return false;
         }
         return new Script(doc.code, doc._id);
     });
  });
};

exports.create = (code) => {
  return exports.connectDB()
  .then((db) => {
      var script = new Script(code);
      var collection = db.collection('scripts');
      return collection.insertOne(script)
        .then((result) => {return result;});
  });
};

exports.update = (_id, code) => {
  return exports.connectDB()
  .then((db) => {
      var script = new Script(code);
      var collection = db.collection('scripts');
      return collection.updateOne({_id: new ObjectId(_id)}, script)
        .then((result) => {return result;});
  });
};

exports.destroy = function(_id) {
  return exports.connectDB()
  .then((db) => {
      var collection = db.collection('scripts');
      return collection.deleteOne({_id: new ObjectId(_id)})
        .then((result) => {return result;});
  });
};
