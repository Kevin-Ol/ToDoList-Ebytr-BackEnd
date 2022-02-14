const { StatusCodes } = require('http-status-codes');

module.exports = (err, _req, res, _next) => {
  if (err.code) {
    const { code, message } = err;
    return res.status(code).json({ message });
  }

  console.log(err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
};
