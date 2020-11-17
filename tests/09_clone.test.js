const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

function getRouteClone(budgetId) {
    if (budgetId) {
        return '/api/budget/' + budgetId + '/clone';
    } else {
        return '/api/budget/clone';
    }
}

describe('9.0 - Clonage de budget', () => {
    beforeEach(() => {
        // Original services
        auth.verifyAuth.callsFake(originalAuth);
    });

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
                .post(getRouteClone(17))
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
                .post(getRouteClone())
                .send({
                    name: name,
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
        });
    });

    describe('9.2 - Cloner un budget', () => {
        test("092001 - Cloner un budget sans authentification", (done) => {
            const name = 'Budget Clone 3'
            const start = '2021-09-25 00:00:00'
            const end = '2021-09-30 23:59:59'

            request(app)
                .post(getRouteClone(17))
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
                .post(getRouteClone(9))
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
                .post(getRouteClone(-1))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
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
                .post(getRouteClone(17))
                .send({
                    name: name,
                    startDate: end,
                    endDate: start
                })
                .expect(400, done);
        });

    });
});