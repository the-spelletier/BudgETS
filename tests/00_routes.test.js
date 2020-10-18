const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

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

    test('000004 - Route 1 categorie', (done) => {
        // Stub the verifyAuth
        auth.verifyAuth.callsFake((req, res, next) => {
            userService.getUser({
                username:'budgets_test001'
            }).then(user => {
                req.user = User.build(user, {raw: true});
                next();
            })
        });
        request(app).get('/api/category/1').expect(404, done);
    });

    test('000005 - Route all categories', (done) => {
        // Stub the verifyAuth
        auth.verifyAuth.callsFake((req, res, next) => {
            userService.getUser({
                username:'budgets_test001'
            }).then(user => {
                req.user = User.build(user, {raw: true});
                next();
            })
        });
        request(app).get('/api/category/').expect(404, done);
    });

    test('000006 - Route 1 ligne', (done) => {
        // Stub the verifyAuth
        auth.verifyAuth.callsFake((req, res, next) => {
            userService.getUser({
                username:'budgets_test001'
            }).then(user => {
                req.user = User.build(user, {raw: true});
                next();
            })
        });
        request(app).get('/api/line/1').expect(404, done);
    });

    test('000007 - Route all lignes', (done) => {
        // Stub the verifyAuth
        auth.verifyAuth.callsFake((req, res, next) => {
            userService.getUser({
                username:'budgets_test001'
            }).then(user => {
                req.user = User.build(user, {raw: true});
                next();
            })
        });
        request(app).get('/api/line/').expect(404, done);
    });

    test("000008 - Supprimer un budget", (done) => {
        // Stub the verifyAuth
        auth.verifyAuth.callsFake((req, res, next) => {
            userService.getUser({
                username:'budgets_test004'
            }).then(user => {
                req.user = User.build(user, {raw: true});
                next();
            })
        });

        request(app)
            .post('/api/budget/13')
            .expect(404, done);
        
    });
});
