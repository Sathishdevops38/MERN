const request = require('supertest');
const express = require('express');
const todosRouter = require('../routes/todos');

const app = express();
app.use(express.json());
app.use('/todos', todosRouter);

describe('Todos API', () => {
  let newTodoId;

  it('should fetch all todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/todos/add')
      .send({
        description: 'Test Todo',
        priority: 'High',
        completed: false,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    newTodoId = res.body.id;
  });

  it('should delete a todo', async () => {
    const res = await request(app).delete(`/todos/${newTodoId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newTodoId);
  });
});
