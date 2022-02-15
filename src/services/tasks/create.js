const tasksModel = require('../../model/tasks');

module.exports = async ({ description, status = 'Pendente', createdAt }) => {
  const task = await tasksModel.create({ description, status, createdAt });

  return task;
};
