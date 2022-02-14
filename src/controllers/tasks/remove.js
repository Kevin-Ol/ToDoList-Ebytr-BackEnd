const { StatusCodes } = require('http-status-codes');
const tasksServices = require('../../services/tasks');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { removeError } = await tasksServices.remove(id);

    if (removeError) {
      return next(removeError);
    }

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};
