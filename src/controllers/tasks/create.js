const { StatusCodes } = require('http-status-codes');
const tasksServices = require('../../services/tasks');
const schemas = require('../../schemas');

module.exports = async (req, res, next) => {
  try {
    const { description, status, createdAt } = req.body;

    const { error } = schemas.createTask.validate({ description, status, createdAt });

    if (error) {
      return next(error);
    }

    const task = await tasksServices.create({ description, status, createdAt });

    return res.status(StatusCodes.CREATED).json({ task });
  } catch (error) {
    return next(error);
  }
};
