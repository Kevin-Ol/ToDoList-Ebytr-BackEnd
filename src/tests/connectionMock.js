const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let DBServer;
let URLMock;

const connection = async () => {
  if (DBServer) {
    return MongoClient.connect(URLMock, OPTIONS);
  }

  DBServer = await MongoMemoryServer.create();
  URLMock = DBServer.getUri();

  return MongoClient.connect(URLMock, OPTIONS);
};

module.exports = connection;
