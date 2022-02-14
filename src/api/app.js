const express = require('express');
const cors = require('cors');
const middlewares = require('../middlewares');
const { tasksRoutes } = require('../routes');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/tasks', tasksRoutes);

app.use(middlewares.error);

module.exports = app;
