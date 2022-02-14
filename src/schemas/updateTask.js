const Joi = require('joi');

const tasksSchema = Joi.object({
  description: Joi.string().messages({
    'string.empty': 'Campo description não pode ser vazio',
    'string.base': 'Campo description deve ser uma string',
  }),
  status: Joi.string().messages({
    'string.empty': 'Campo status não pode ser vazio',
    'string.base': 'Campo status deve ser uma string',
  }),
}).xor('description', 'status')
  .messages({
    'object.missing': 'Campo description ou status deve ser informado',
    'object.xor': 'Apenas um campo pode ser alterado',
  });

module.exports = tasksSchema;
