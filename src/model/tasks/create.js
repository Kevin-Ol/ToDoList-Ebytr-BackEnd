const connection = require('../connection');

module.exports = async (task) => {
  const db = await connection();
  await db.collection('tasks').insertOne(task);
  return task;
};
