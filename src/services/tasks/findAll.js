const tasksModel = require('../../model/tasks');

module.exports = async () => {
  const tasks = await tasksModel.findAll();

  return tasks;
};
