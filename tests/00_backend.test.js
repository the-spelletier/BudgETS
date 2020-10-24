const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');
const config = require('../config/jsonConfig');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');


const app = require('../app.js');

describe('0.0 - Backend', () => {
    beforeEach(() => {
        auth.verifyAuth.callsFake(originalAuth);
    });

    describe('0.1 - Routes', () => {
        test('001001 - Route vers la racine', (done) => {
            request(app).get('/').expect('Content-Type', /json/).expect(
                200,
                {
                    message: 'Bienvenue dans BudgETS!'
                },
                done
            );
        });

        test('001002 - Mauvais opérateur vers la racine', (done) => {
            request(app).post('/').expect(404, done);
        });

        test('001003 - Route invalide', (done) => {
            request(app).get('/abc').expect(404, done);
        });

        test('001004 - Route 1 categorie', (done) => {
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

        test('001005 - Route all categories', (done) => {
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

        test('001006 - Route 1 ligne', (done) => {
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

        test('001007 - Route all lignes', (done) => {
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

        test("001008 - Supprimer un budget", (done) => {
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

    describe('0.2 - Middleware', () => {
        test('002001 - Verify Auth', (done) => {
            app.get(
                '/testAuth',
                auth.verifyAuth,
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );
            
            const payload = {
                id: 1,
                name: 'budgets_test001',
                admin: true
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: config.jwtAlgo,
                expiresIn: config.ttl
            });

            request(app)
                .get('/testAuth')
                .set('Authorization', `Bearer ${token}`)
                .expect(200, done)
        });

        test('002002 - Verify Auth sans authentification', (done) => {
            app.get(
                '/testAuth',
                auth.verifyAuth,
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            request(app)
                .get('/testAuth')
                //.set('Authorization', `Bearer ${response.body.token}`)
                .expect(401, done);
        });

        test('002003 - Verify Auth sans token', (done) => {
            app.get(
                '/testAuth',
                auth.verifyAuth,
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            request(app)
                .get('/testAuth')
                .set('Authorization', `Bearer`)
                .expect(401, done)
        });

        test('002004 - Verify Auth mauvais token', (done) => {
            app.get(
                '/testAuth',
                auth.verifyAuth,
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            request(app)
                .get('/testAuth')
                .set('Authorization', `Bearer 123`)
                .expect(401, done)
        });

        test('002005 - Verify Auth mauvais user', (done) => {
            app.get(
                '/testAuth',
                auth.verifyAuth,
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            const payload = {
                id: 99,
                name: 'dummy',
                admin: true
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: config.jwtAlgo,
                expiresIn: config.ttl
            });

            request(app)
                .get('/testAuth')
                .set('Authorization', `Bearer ${token}`)
                .expect(401, done)
        });

        test('002006 - Verify Admin', (done) => {
            app.get(
                '/testAdmin',
                [auth.verifyAuth, auth.verifyAdmin],
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            const payload = {
                id: 1,
                name: 'budgets_test001',
                admin: true
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: config.jwtAlgo,
                expiresIn: config.ttl
            });

            request(app)
                .get('/testAdmin')
                .set('Authorization', `Bearer ${token}`)
                .expect(200, done)
        });

        test('002007 - Verify not Admin', (done) => {
            app.get(
                '/testAdmin',
                [auth.verifyAuth, auth.verifyAdmin],
                function (req, res) {
                    res.status(200);
                    res.send();
                }
            );

            const payload = {
                id: 2,
                name: 'budgets_test002',
                admin: false
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                algorithm: config.jwtAlgo,
                expiresIn: config.ttl
            });

            request(app)
                .get('/testAdmin')
                .set('Authorization', `Bearer ${token}`)
                .expect(401, done)
        });
    });
});
