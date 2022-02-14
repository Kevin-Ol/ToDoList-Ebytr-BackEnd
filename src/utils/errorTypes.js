const { StatusCodes } = require('http-status-codes');

module.exports = {
  taskNotFound: {
    code: StatusCodes.NOT_FOUND,
    message: 'Tarefa não encontrada',
  },
  invalidId: {
    code: StatusCodes.BAD_REQUEST,
    message: 'Id inválido',
  },
};
