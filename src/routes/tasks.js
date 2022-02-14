const { Router } = require('express');
const taskControllers = require('../controllers/tasks');

const tasksRoutes = Router();

tasksRoutes.post('/', taskControllers.create);
tasksRoutes.get('/', taskControllers.findAll);
tasksRoutes.put('/:id', taskControllers.update);
tasksRoutes.delete('/:id', taskControllers.remove);

module.exports = tasksRoutes;
