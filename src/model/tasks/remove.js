const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports = async (id) => {
  const db = await connection();
  const { value: deletedTask } = await db.collection('tasks').findOneAndDelete(
    { _id: ObjectId(id) },
  );
  return deletedTask;
};
