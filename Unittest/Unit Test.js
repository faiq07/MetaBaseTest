//Unit test 1
const request = require('supertest');
const app = require('./app');

describe('GET /api/database', () => {
  it('responds with a list of databases', async () => {
    const response = await request(app).get('/api/database');
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });
});


//Unit test 2
const request = require('supertest');
const app = require('./app');

describe('POST /api/user', () => {
  it('creates a new user', async () => {
    const user = {
      email: 'faiqijaz43@gmail.com',
      password: 'mAlIk8080',
      first_name: 'Faiq',
      last_name: 'Malik'
    };
    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
    expect(response.body.email).toEqual(user.email);
  });
});

//Unit test 3
const request = require('supertest');
const app = require('./app');

describe('PUT /api/user/{id}', () => {
  it('updates the user details', async () => {
    const user = {
        email: 'faiqijaz43@gmail.com',
        password: 'mAlIk8080',
        first_name: 'Faiq',
        last_name: 'Malik'
    };
    const createUserResponse = await request(app).post('/api/user').send(user);
    const userId = createUserResponse.body.id;
    const updatedUser = {
      email: 'faiqijaz143@gmail.com',
      first_name: 'Faiq',
      last_name: 'Malik'
    };
    const response = await request(app).put(`/api/user/${userId}`).send(updatedUser);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.email).toEqual(updatedUser.email);
    expect(response.body.first_name).toEqual(updatedUser.first_name);
    expect(response.body.last_name).toEqual(updatedUser.last_name);
  });
});


//Unit test 4
const request = require('supertest');
const app = require('./app');

describe('DELETE /api/user/f667ba71-1ee9-4f88-93a0-26571401a281', () => {
  it('deletes the user', async () => {
    const user = {
      email: 'faiqijaz43@gmail.com',
      password: 'mAlIk8080',
      first_name: 'Faiq',
      last_name: 'Malik'
    };
    const createUserResponse = await request(app).post('/api/user').send(user);
    const userId = createUserResponse.body.id;
    const response = await request(app).delete(`/api/user/f667ba71-1ee9-4f88-93a0-26571401a281`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.deleted_id).toEqual(userId);
  });
});


//Unit test 5
test('get dashboard by ID', async () => {
    const dashboardID = 1;
    const response = await request(app).get(`/api/dashboard/f667ba71-1ee9-4f88-93a0-26571401a281`)
      .set('X-Metabase-Session', API_TOKEN)
      .expect(200);
    expect(response.body.id).toBe(dashboardID);
  });
  

  //Unit test 6
  test('get question by ID', async () => {
    const questionID = 1;
    const response = await request(app).get(`/api/question/2`)
      .set('X-Metabase-Session', API_TOKEN)
      .expect(402);
    expect(response.body.id).toBe(questionID);
  });

  
// Unit test 7
test('create new dashboard', async () => {
    const newDashboard = {
      name: 'New Dashboard',
      description: 'This is a new dashboard.',
      parameters: {},
      cache_ttl: null,
      options: {},
      visualization_settings: {},
      dataset_query: {
        type: 'native',
        native: { query: 'SELECT * FROM mytable' }
      }
    };
    const response = await request(app).post('/api/dashboard')
      .set('X-Metabase-Session',"f667ba71-1ee9-4f88-93a0-26571401a281")
      .send(newDashboard)
      .expect(200);
    expect(response.body.name).toBe(newDashboard.name);
  });
  
  
//Unit test 8
test('update existing dashboard', async () => {
    const dashboardID = 1;
    const updatedDashboard = {
      name: 'Updated Dashboard',
      description: 'This dashboard has been updated.',
      parameters: {},
      cache_ttl: null,
      options: {},
      visualization_settings: {},
      dataset_query: {
        type: 'native',
        native: { query: 'SELECT * FROM mytable WHERE column1 = 42' }
      }
    };
    const response = await request(app).put(`/api/dashboard/${dashboardID}`)
      .set('X-Metabase-Session', "f667ba71-1ee9-4f88-93a0-26571401a281")
      .send(updatedDashboard)
      .expect(200);
    expect(response.body.name).toBe(updatedDashboard.name);
  });

  //Unit test 9
  test('delete existing dashboard', async () => {
    const dashboardID = 1;
    await request(app).delete(`/api/dashboard/${dashboardID}`)
      .set('X-Metabase-Session', "f667ba71-1ee9-4f88-93a0-26571401a281")
      .expect(200);
    const response = await request(app).get(`/api/dashboard/${dashboardID}`)
      .set('X-Metabase-Session', "f667ba71-1ee9-4f88-93a0-26571401a281")
      .expect(404);
  });
  
  