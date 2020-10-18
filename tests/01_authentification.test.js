const request = require('supertest');
const app = require('../app.js');

describe('1.0 - Authentification', () => {
    describe('1.1 - Utilisateur veut se logger', () => {
        test('011001 - Authentification correcte', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: 'budgets_test01',
                    password: 'test123'
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body.token).not.toBeUndefined();
                    done();
                });
        });

        test('011002 - Mauvais user', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: 'budgets_test',
                    password: 'test123'
                })
                .expect('Content-Type', /json/)
                .expect(401)
                .then((response) => {
                    expect(response.body.token).toBeUndefined();
                    done();
                });
        });

        test('011003 - Aucun user', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    password: 'test123'
                })
                .expect('Content-Type', /json/)
                .expect(401)
                .then((response) => {
                    expect(response.body.token).toBeUndefined();
                    done();
                });
        });

        test('011004 - Mauvais mot de passe', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: 'budgets_test01',
                    password: 'test1234'
                })
                .expect('Content-Type', /json/)
                .expect(401)
                .then((response) => {
                    expect(response.body.token).toBeUndefined();
                    done();
                });
        });

        test('011005 - Aucun mot de passe', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: 'budgets_test01'
                })
                .expect('Content-Type', /json/)
                .expect(401)
                .then((response) => {
                    expect(response.body.token).toBeUndefined();
                    done();
                });
        });
    });
});
