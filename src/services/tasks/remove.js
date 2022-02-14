const { ObjectId } = require('mongodb');
const tasksModel = require('../../model/tasks');
const errorTypes = require('../../utils/errorTypes');

module.exports = async (id) => {
  if (!ObjectId.isValid(id)) {
    return { removeError: errorTypes.invalidId };
  }

  const removedTask = await tasksModel.remove(id);

  if (!removedTask) {
    return { removeError: errorTypes.taskNotFound };
  }

  return {};
};
