const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

module.exports = (err, _req, res, _next) => {
  if (Joi.isError(err)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }

  console.log(err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
};
