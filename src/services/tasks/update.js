const { ObjectId } = require('mongodb');
const tasksModel = require('../../model/tasks');
const { errorTypes } = require('../../utils');

module.exports = async (id, { description, status }) => {
  if (!ObjectId.isValid(id)) {
    return { updateError: errorTypes.invalidId };
  }

  const updateField = description ? { description } : { status };

  const updatedTask = await tasksModel.update(id, updateField);

  if (!updatedTask) {
    return { updateError: errorTypes.taskNotFound };
  }

  return { updatedTask };
};
