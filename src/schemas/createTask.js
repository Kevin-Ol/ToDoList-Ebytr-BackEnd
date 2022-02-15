const Joi = require('joi');

const tasksSchema = Joi.object({
  description: Joi.string().required().messages({
    'any.required': 'Campo description é obrigatório',
    'string.empty': 'Campo description não pode ser vazio',
    'string.base': 'Campo description deve ser uma string',
  }),
  status: Joi.string().required().messages({
    'any.required': 'Campo status é obrigatório',
    'string.empty': 'Campo status não pode ser vazio',
    'string.base': 'Campo status deve ser uma string',
  }),
  createdAt: Joi.date().iso().required().messages({
    'any.required': 'Campo createdAt é obrigatório',
    'date.format': 'Campo createdAt deve ser uma data no formato iso',
  }),
});

module.exports = tasksSchema;
