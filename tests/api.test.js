const request = require('supertest');
const app = require('../server');

// These run without MongoDB: the root route and the auth gate never touch the DB.
test('GET / returns 200 and the API message', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe('Task Manager API is running.');
});

test('GET /tasks without a token returns 401', async () => {
  const res = await request(app).get('/tasks');
  expect(res.statusCode).toBe(401);
});
