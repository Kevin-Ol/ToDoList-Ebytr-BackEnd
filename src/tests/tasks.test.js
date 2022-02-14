const {
  describe, before, after, it,
} = require('mocha');
const chai = require('chai');
const { expect } = require('chai');

const { stub } = require('sinon');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');

const connection = require('./connectionMock');
const app = require('../api/app');
const tasksServices = require('../services/tasks');

chai.use(chaiHttp);

const DB_NAME = 'ToDoList';

describe('1 - POST /tasks', () => {
  let connectionMock;
  let db;

  before(async () => {
    connectionMock = await connection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    db = connectionMock.db(DB_NAME);
  });

  after(async () => {
    MongoClient.connect.restore();
    await db.collection('tasks').deleteMany({});
  });

  describe(('Quando o campo description não é enviado'), () => {
    const descriptionRequired = { message: 'Campo description é obrigatório' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/tasks')
        .send({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description é obrigatório"', () => {
      expect(response.body).to.be.deep.equal(descriptionRequired);
    });
  });

  describe(('Quando o campo description é enviado vazio'), () => {
    const descriptionEmpty = { message: 'Campo description não pode ser vazio' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/tasks')
        .send({ description: '' });
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description é obrigatório"', () => {
      expect(response.body).to.be.deep.equal(descriptionEmpty);
    });
  });

  describe(('Quando o campo description não é uma string'), () => {
    const descriptionString = { message: 'Campo description deve ser uma string' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/tasks')
        .send({ description: 2 });
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description é obrigatório"', () => {
      expect(response.body).to.be.deep.equal(descriptionString);
    });
  });

  describe('Quando ocorre um erro interno', () => {
    const internalError = { message: 'Internal Server Error' };

    let response;

    before(async () => {
      stub(tasksServices, 'create').rejects();

      response = await chai.request(app)
        .post('/tasks')
        .send({ description: 'Fazer compras' });
    });

    after(() => {
      tasksServices.create.restore();
    });

    it('Retorna status 500', () => {
      expect(response).to.have.status(500);
    });

    it('Retorna objeto com mensagem de erro Internal Server Error', () => {
      expect(response.body).to.be.deep.equal(internalError);
    });
  });

  describe(('Quando o campo description é válido'), () => {
    let response = {};

    before(async () => {
      response = await chai.request(app)
        .post('/tasks')
        .send({ description: 'Fazer compras' });
    });

    it('Retorna status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna objeto com a task inserida', async () => {
      const dbTask = await db.collection('tasks').findOne({ description: 'Fazer compras' });
      const task = { ...dbTask, _id: dbTask._id.toString() };
      expect(response.body).to.be.deep.equal({ task });
    });
  });
});
