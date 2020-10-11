const request = require('supertest');
const app = require('../app.js');

describe('0.0 - Routes', () => {
    test('000001 - Route vers la racine', (done) => {
        request(app).get('/').expect('Content-Type', /json/).expect(
            200,
            {
                message: 'Bienvenue dans BudgETS!'
            },
            done
        );
    });

    test('000002 - Mauvais opérateur vers la racine', (done) => {
        request(app).post('/').expect(404, done);
    });

    test('000003 - Route invalide', (done) => {
        request(app).get('/abc').expect(404, done);
    });
});
