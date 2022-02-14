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

    it('Retorna objeto com mensagem de erro "Campo description não pode ser vazio"', () => {
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

    it('Retorna objeto com mensagem de erro "Campo description deve ser uma string"', () => {
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

    it('Retorna objeto com mensagem de erro "Internal Server Error"', () => {
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

describe('2 - GET /tasks', () => {
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

  describe('Quando ocorre um erro interno', () => {
    const internalError = { message: 'Internal Server Error' };

    let response;

    before(async () => {
      stub(tasksServices, 'findAll').rejects();

      response = await chai.request(app)
        .get('/tasks');
    });

    after(() => {
      tasksServices.findAll.restore();
    });

    it('Retorna status 500', () => {
      expect(response).to.have.status(500);
    });

    it('Retorna objeto com mensagem de erro "Internal Server Error"', () => {
      expect(response.body).to.be.deep.equal(internalError);
    });
  });

  describe(('Retorna todas as tasks'), () => {
    const task1 = { description: 'Fazer compras', status: 'Pendente' };
    const task2 = { description: 'Limpar o quarto', status: 'Pendente' };

    let response = {};

    before(async () => {
      await db.collection('tasks').insertMany([task1, task2]);

      response = await chai.request(app)
        .get('/tasks');
    });

    it('Retorna status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna array com as tasks do banco', async () => {
      const dbTask = await db.collection('tasks').find({}).toArray();
      const dbTasks = dbTask.map(({ _id, ...info }) => ({ _id: _id.toString(), ...info }));
      expect(response.body).to.be.deep.equal({ tasks: dbTasks });
    });
  });
});

describe('3 - PUT /tasks', () => {
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

  describe(('Quando nenhum campo é enviado'), () => {
    const fieldsRequired = { message: 'Campo description ou status deve ser informado' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1');
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description ou status deve ser informado"', () => {
      expect(response.body).to.be.deep.equal(fieldsRequired);
    });
  });

  describe(('Quando o campo description é enviado vazio'), () => {
    const descriptionEmpty = { message: 'Campo description não pode ser vazio' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ description: '' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description não pode ser vazio"', () => {
      expect(response.body).to.be.deep.equal(descriptionEmpty);
    });
  });

  describe(('Quando o campo description não é uma string'), () => {
    const descriptionString = { message: 'Campo description deve ser uma string' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ description: 1 });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo description deve ser uma string"', () => {
      expect(response.body).to.be.deep.equal(descriptionString);
    });
  });

  describe(('Quando o campo status é enviado vazio'), () => {
    const statusEmpty = { message: 'Campo status não pode ser vazio' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ status: '' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo status não pode ser vazio"', () => {
      expect(response.body).to.be.deep.equal(statusEmpty);
    });
  });

  describe(('Quando o campo status não é uma string'), () => {
    const statusString = { message: 'Campo status deve ser uma string' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ status: 1 });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Campo status deve ser uma string"', () => {
      expect(response.body).to.be.deep.equal(statusString);
    });
  });

  describe(('Quando os campos description e status são enviados juntos'), () => {
    const onlyOneFieldAllowed = { message: 'Apenas um campo pode ser alterado' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ description: 'Fazer compras', status: 'Em andamento' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Apenas um campo pode ser alterado"', () => {
      expect(response.body).to.be.deep.equal(onlyOneFieldAllowed);
    });
  });

  describe('Quando ocorre um erro interno', () => {
    const internalError = { message: 'Internal Server Error' };

    let response;

    before(async () => {
      stub(tasksServices, 'update').rejects();

      response = await chai.request(app)
        .put('/tasks/1')
        .send({ description: 'Fazer compras' });
    });

    after(() => {
      tasksServices.update.restore();
    });

    it('Retorna status 500', () => {
      expect(response).to.have.status(500);
    });

    it('Retorna objeto com mensagem de erro "Internal Server Error"', () => {
      expect(response.body).to.be.deep.equal(internalError);
    });
  });

  describe(('Quando o id informado é inválido'), () => {
    const invalidId = { message: 'Id inválido' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/1')
        .send({ description: 'Fazer compras' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Id inválido"', () => {
      expect(response.body).to.be.deep.equal(invalidId);
    });
  });

  describe(('Quando a task informada não existe'), () => {
    const taskNotFound = { message: 'Tarefa não encontrada' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .put('/tasks/620a81a47b50e2e00ca81772')
        .send({ description: 'Fazer compras' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 404', () => {
      expect(response).to.have.status(404);
    });

    it('Retorna objeto com mensagem de erro "Tarefa não encontrada"', () => {
      expect(response.body).to.be.deep.equal(taskNotFound);
    });
  });

  describe(('Quando apenas description é enviado'), () => {
    let taskId;
    const task1 = { description: 'Fazer compras', status: 'Pendente' };
    const expectedTask = { description: 'Limpar o quarto', status: 'Pendente' };

    let response = {};

    before(async () => {
      const { insertedId } = await db.collection('tasks').insertOne(task1);
      taskId = insertedId.toString();

      response = await chai.request(app)
        .put(`/tasks/${taskId}`)
        .send({ description: 'Limpar o quarto' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna task alterada corretamente', async () => {
      expect(response.body).to.be.deep.equal({
        task: {
          _id: taskId,
          ...expectedTask,
        },
      });
    });
  });

  describe(('Quando apenas status é enviado'), () => {
    let taskId;
    const task1 = { description: 'Fazer compras', status: 'Pendente' };
    const expectedTask = { description: 'Fazer compras', status: 'Em andamento' };

    let response = {};

    before(async () => {
      const { insertedId } = await db.collection('tasks').insertOne(task1);
      taskId = insertedId.toString();

      response = await chai.request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: 'Em andamento' });
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna task alterada corretamente', async () => {
      expect(response.body).to.be.deep.equal({
        task: {
          _id: taskId,
          ...expectedTask,
        },
      });
    });
  });
});

describe('4 - DELETE /tasks', () => {
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

  describe('Quando ocorre um erro interno', () => {
    const internalError = { message: 'Internal Server Error' };

    let response;

    before(async () => {
      stub(tasksServices, 'remove').rejects();

      response = await chai.request(app)
        .delete('/tasks/1');
    });

    after(() => {
      tasksServices.remove.restore();
    });

    it('Retorna status 500', () => {
      expect(response).to.have.status(500);
    });

    it('Retorna objeto com mensagem de erro "Internal Server Error"', () => {
      expect(response.body).to.be.deep.equal(internalError);
    });
  });

  describe(('Quando o id informado é inválido'), () => {
    const invalidId = { message: 'Id inválido' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .delete('/tasks/1');
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna objeto com mensagem de erro "Id inválido"', () => {
      expect(response.body).to.be.deep.equal(invalidId);
    });
  });

  describe(('Quando a task informada não existe'), () => {
    const taskNotFound = { message: 'Tarefa não encontrada' };

    let response = {};

    before(async () => {
      response = await chai.request(app)
        .delete('/tasks/620a81a47b50e2e00ca81772');
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 404', () => {
      expect(response).to.have.status(404);
    });

    it('Retorna objeto com mensagem de erro "Tarefa não encontrada"', () => {
      expect(response.body).to.be.deep.equal(taskNotFound);
    });
  });

  describe(('Quando a task informada é válida'), () => {
    const task1 = { description: 'Fazer compras', status: 'Pendente' };

    let response = {};

    before(async () => {
      const { insertedId } = await db.collection('tasks').insertOne(task1);

      response = await chai.request(app)
        .delete(`/tasks/${insertedId}`);
    });

    after(async () => {
      await db.collection('tasks').deleteMany({});
    });

    it('Retorna status 204', () => {
      expect(response).to.have.status(204);
    });

    it('Remove do banco e retorna sem conteúdo', async () => {
      const tasks = await db.collection('tasks').find({}).toArray();
      expect(tasks).to.be.deep.equal([]);
      expect(response.body).to.be.deep.equal({});
    });
  });
});
