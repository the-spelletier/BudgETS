const request = require('supertest');
const app = require('../app.js');

describe('0.0 - Routes', () => {
    it('000001 - Route vers la racine', done => {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Bienvenue dans BudgETS!'
        },
        done);
    });

    it('000002 - Mauvais opérateur vers la racine', done => {
      request(app)
        .post('/')
        .expect(404,done);
    });

    it('000003 - Route invalide', done => {
      request(app)
        .get('/abc')
        .expect(404,done);
    });
})