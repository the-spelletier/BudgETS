const request = require('supertest');
const sinon = require('sinon');

const categoryService = require('../services/category');
const lineService = require('../services/line');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalAddLine = lineService.addLine;
const stubAddLine = sinon.stub(lineService, 'addLine');

const originalAddCategory = categoryService.addCategory;
const stubAddCategory = sinon.stub(categoryService, 'addCategory');

const app = require('../app.js');

describe('9.0 - Clonage de budget', () => {
    beforeEach(() => {
        // Original services
        auth.verifyAuth.callsFake(originalAuth);
        categoryService.addCategory.callsFake(originalAddCategory);
        lineService.addLine.callsFake(originalAddLine);
    });
/*
    describe('9.1 - Route pour cloner', () => {
        test('091001 - Cloner un budget', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'Budget Clone 1'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(200)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            startDate: start,
                            endDate: end,
                            isActive: false,
                            userId: '5'
                        })
                    );
                    done();
                });
        });

        test('091002 - Route vers cloner un budget sans id', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 2'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
        });
    });
*/
    describe('9.2 - Cloner un budget', () => {
        /*test("092001 - Cloner un budget sans authentification", (done) => {
            const name = 'Budget Clone 3'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(401, done);
            
        });

        test('092002 - Cloner un budget qui ne m\'appartient pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 4'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/9')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
        });

        test('092003 - Cloner un budget qui n\'existe pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 5'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/-1')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
        });

        test('092004 - Cloner un budget sans nom', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
        });

        test('092005 - Cloner un budget avec nom vide', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = ''
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
        });

        test('092006 - Cloner un budget sans date de début', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 6'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    endDate: end
                })
                .expect(400, done);
        });

        test('092007 - Cloner un budget avec date de début vide', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 7'
            const start = ''
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
        });

        test('092008 - Cloner un budget sans date de fin', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 8'
            const start = '2021-09-25 00:00:00'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start
                })
                .expect(400, done);
        });

        test('092009 - Cloner un budget avec date de fin vide', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 9'
            const start = '2021-09-25 00:00:00'
            const end = ''

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
        });

        test('092010 - Cloner un budget avec date de fin < date de début', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'Budget Clone 10'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: end,
                    endDate: start
                })
                .expect(400, done);
        });

        test('092011 - Cloner un budget avec nom non unique', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'budgetTest00201'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(403, done);
        });
        */
        test('092012 - Cloner un budget, stub ajouter lignes', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            lineService.addLine.callsFake(line => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            const name = 'Budget Clone 12'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(200)
                .then((response) => {
                    console.log(response.body);
                    done();
                });
        });

        /*test('092013 - Cloner un budget, stub ajouter categories', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username:'budgets_test005'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            categoryService.addCategory.callsFake(line => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            const name = 'Budget Clone 13'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post('/api/budget/clone/17')
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(200)
                .then((response) => {
                    console.log(response.body);
                    done();
                });
        });
        */

    });
});