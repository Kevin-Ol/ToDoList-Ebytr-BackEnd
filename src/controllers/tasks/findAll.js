const { StatusCodes } = require('http-status-codes');
const taskServices = require('../../services/tasks');

module.exports = async (_req, res, next) => {
  try {
    const tasks = await taskServices.findAll();

    return res.status(StatusCodes.OK).json({ tasks });
  } catch (error) {
    return next(error);
  }
};
