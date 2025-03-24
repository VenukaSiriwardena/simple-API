const http = require('http');
const assert = require('chai').assert;
const axios = require('axios'); // We'll use axios to make requests to the API

const BASE_URL = 'http://localhost:3000/api/users';

// Start the server before running tests
let server;
before((done) => {
  server = require('../index'); // Assuming your server is in index.js
  done();
});

// Stop the server after tests are complete
after((done) => {
  server.close();
  done();
});

describe('User API', () => {
  it('should return all users', async () => {
    const response = await axios.get(BASE_URL);
    assert.equal(response.status, 200);
    assert.isArray(response.data);
    assert.isAtLeast(response.data.length, 0);
  });

  it('should return a user by ID', async () => {
    const response = await axios.get(`${BASE_URL}/1`);
    assert.equal(response.status, 200);
    assert.property(response.data, 'id');
    assert.equal(response.data.id, 1);
  });

  it('should create a new user', async () => {
    const newUser = { name: 'Alice', email: 'alice@example.com' };
    const response = await axios.post(BASE_URL, newUser);
    assert.equal(response.status, 201);
    assert.property(response.data, 'id');
    assert.equal(response.data.name, newUser.name);
    assert.equal(response.data.email, newUser.email);
  });

  it('should update an existing user', async () => {
    const updatedUser = { name: 'John Updated', email: 'john.updated@example.com' };
    const response = await axios.put(`${BASE_URL}/1`, updatedUser);
    assert.equal(response.status, 200);
    assert.equal(response.data.name, updatedUser.name);
    assert.equal(response.data.email, updatedUser.email);
  });

  it('should delete a user', async () => {
    const response = await axios.delete(`${BASE_URL}/2`);
    assert.equal(response.status, 204);
  });
});