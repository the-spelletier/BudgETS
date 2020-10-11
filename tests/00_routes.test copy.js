const request = require('supertest');
const app = require('../app.js');

// INFO: Dummy code for futur reference. Will be removed soon

let token;

beforeAll((done) => {
    request(app)
        .post('/api/login')
        .send({
            username: 'budgets_admin',
            password: 'admin_2020'
        })
        .end((err, response) => {
            if (err) console.log(err);
            token = response.body.token;
            done();
        });
});

describe('Budget API', () => {
    it('should show all budgets', (done) => {
        request(app)
            .get('/api/budget')
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                console.log(response.text);
                done();
            });
    });
});
