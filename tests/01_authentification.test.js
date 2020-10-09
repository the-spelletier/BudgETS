const request = require('supertest');
const app = require('../app.js');

describe('1.0 - Authentification', () => {
    it('011001 - Authentification correcte', done => {
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test01',
          password:'test123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.token).not.toBeUndefined();
          done();
        });
    });

    it('011002 - Mauvais user', done => {
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test',
          password:'test123'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .then(response => {
          expect(response.body.token).toBeUndefined();
          done();
        });
    });

    it('011003 - Aucun user', done => {
      request(app)
        .post('/api/login')
        .send({
          password:'test123'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .then(response => {
          expect(response.body.token).toBeUndefined();
          done();
        });
    });

    it('011004 - Mauvais mot de passe', done => {
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test01',
          password:'test1234'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .then(response => {
          expect(response.body.token).toBeUndefined();
          done();
        });
    });

    it('011005 - Aucun mot de passe', done => {
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test01'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .then(response => {
          expect(response.body.token).toBeUndefined();
          done();
        });
    });

    it('011006 - Déjà authentifié', done => {
      let token;
      // Pre-test
      request(app)
        .post('/api/login')
        .send({
            username:'budgets_test01',
            password:'test123'
        })
        .end((err, response) => {
            token = response.body.token;
        });

      // Test
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test01',
          password:'test123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.token).not.toBeUndefined();
          expect(response.body.token).toEqual(token);
          done();
        });
    });

    it('011007 - Autre utilisateur', done => {
      let token;
      // Pre-test
      request(app)
        .post('/api/login')
        .send({
            username:'budgets_test01',
            password:'test123'
        })
        .end((err, response) => {
            token = response.body.token;
        });

      // Test
      request(app)
        .post('/api/login')
        .send({
          username:'budgets_test02',
          password:'test123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.token).not.toBeUndefined();
          expect(response.body.token).not.toEqual(token);
          done();
        });
    });
})