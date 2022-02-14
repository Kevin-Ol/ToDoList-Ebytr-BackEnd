const { StatusCodes } = require('http-status-codes');
const tasksServices = require('../../services/tasks');
const schemas = require('../../schemas');

module.exports = async (req, res, next) => {
  try {
    const { description } = req.body;

    const { error } = schemas.createTask.validate({ description });

    if (error) {
      return next(error);
    }

    const task = await tasksServices.create({ description });

    return res.status(StatusCodes.CREATED).json({ task });
  } catch (error) {
    return next(error);
  }
};
