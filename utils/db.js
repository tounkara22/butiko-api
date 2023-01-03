const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://tounkara22:hE2OlltEdC9hqqYY@cluster0.zlgzmmq.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((e) => {
      throw e;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "Connection failed!";
};

// export functions
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
