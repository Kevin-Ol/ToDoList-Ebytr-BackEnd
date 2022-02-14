const { MongoClient } = require('mongodb');

const MONGO_DB_URL = 'mongodb://localhost:27017/ToDoList';
const DB_NAME = 'ToDoList';

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let db = null;

const connection = () => (db || MongoClient.connect(MONGO_DB_URL, OPTIONS)
  .then((conn) => {
    db = conn.db(DB_NAME);
    return db;
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
);

module.exports = connection;
