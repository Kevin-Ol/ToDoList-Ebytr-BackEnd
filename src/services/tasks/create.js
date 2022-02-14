const tasksModel = require('../../model/tasks');

module.exports = async ({ description, status = 'Pendente' }) => {
  const createdAt = new Date();

  const task = await tasksModel.create({ description, status, createdAt });

  return task;
};
