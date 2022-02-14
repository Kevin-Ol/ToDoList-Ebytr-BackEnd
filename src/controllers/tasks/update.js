const { StatusCodes } = require('http-status-codes');
const schemas = require('../../schemas');
const taskServices = require('../../services/tasks');

module.exports = async (req, res, next) => {
  try {
    const { description, status } = req.body;
    const { id } = req.params;

    const { error } = schemas.updateTask.validate({ description, status });

    if (error) {
      return next(error);
    }

    const { updatedTask, updateError } = await taskServices.update(id, { description, status });

    if (updateError) {
      return next(updateError);
    }

    return res.status(StatusCodes.OK).json({ task: updatedTask });
  } catch (error) {
    return next(error);
  }
};
