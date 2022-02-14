const tasksModel = require('../../model/tasks');

module.exports = async ({ description, status = 'Pendente' }) => {
  const task = await tasksModel.create({ description, status });

  return task;
};
