const { Router } = require('express');
const taskControllers = require('../controllers/tasks');

const tasksRoutes = Router();

tasksRoutes.post('/', taskControllers.create);

module.exports = tasksRoutes;
