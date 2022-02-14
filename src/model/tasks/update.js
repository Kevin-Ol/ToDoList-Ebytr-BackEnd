const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports = async (id, field) => {
  const db = await connection();
  const { value: updatedTask } = await db.collection('tasks').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: field },
    { returnDocument: 'after' },
  );

  return updatedTask;
};
