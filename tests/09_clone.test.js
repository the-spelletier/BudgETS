const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

describe('9.0 - Clonage de budget', () => {
    describe('9.1 - Route pour cloner', () => {
        test('091001 - Route vers cloner un budget', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .post('/api/budget/clone/5')
                .expect(200, done);
        });

        test('091002 - Route vers cloner un budget sans id', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .post('/api/budget/clone')
                .expect(404, done);
        });
    });

    describe('9.2 - Cloner un budget', () => {
        test('092001 - Cloner un budget', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget/clone/5')
                .expect(200)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: 'budgetTest00201',
                            startDate: start,
                            endDate: end,
                            isActive: true,
                            userId: '2'
                        })
                    );
                    done();
                });
        });

        test("092001 - Cloner un budget sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget/clone/5')
                .expect(401, done);
            
        });

        test('092003 - Cloner un budget qui ne m\'appartient pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .post('/api/budget/clone/5')
                .expect(404, done);
        });

        test('092004 - Cloner un budget qui n\'existe pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .post('/api/budget/clone/-1')
                .expect(404, done);
        });

    });
});