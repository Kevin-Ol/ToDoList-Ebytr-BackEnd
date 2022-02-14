const { StatusCodes } = require('http-status-codes');
const tasksServices = require('../../services/tasks');

module.exports = async (_req, res, next) => {
  try {
    const tasks = await tasksServices.findAll();

    return res.status(StatusCodes.OK).json({ tasks });
  } catch (error) {
    return next(error);
  }
};
