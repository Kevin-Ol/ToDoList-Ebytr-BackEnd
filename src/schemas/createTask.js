const Joi = require('joi');

const tasksSchema = Joi.object({
  description: Joi.string().required().messages({
    'any.required': 'Campo description é obrigatório',
    'string.empty': 'Campo description não pode ser vazio',
    'string.base': 'Campo description deve ser uma string',
  }),
});

module.exports = tasksSchema;
