const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

function getRoute(budgetId) {
    return '/api/budget/' + budgetId + '/category/summary';
}

function sortBody(body) {
    body.sort((a,b) => (parseInt(a.id) < parseInt(b.id)) ? -1 : ((parseInt(a.id) > parseInt(b.id)) ? 1 : 0));
}

describe('6.0 - Sommaire des revenus', () => {
    beforeEach(() => {
        auth.verifyAuth.callsFake(originalAuth);
    });

    describe('6.1 - Accès au sommaire', () => {
        test('061001 - Obtenir le sommaire', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get(getRoute(1))
                .query({ type: 'revenue' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(2);
                    expect(response.body[0]).toEqual({
                        id: '2',
                        name: 'categoryTest0102',
                        type: 'revenue',
                        orderNumber: 1,
                        budgetId: '1',
                        real: '40.00',
                        estimate: '4.00',
                        displayName: 'R - 001 - categoryTest0102'
                    });
                    expect(response.body[1]).toEqual({
                        id: '4',
                        name: 'categoryTest0104',
                        type: 'revenue',
                        orderNumber: 1,
                        budgetId: '1',
                        real: '0.00',
                        estimate: '0.00',
                        displayName: 'R - 001 - categoryTest0104'
                    });
                    done();
                });
        });

        test('061002 - Obtenir le sommaire sans authentification', (done) => {
            request(app)
                .get(getRoute(1))
                .expect(401, done);
        });

        test('061003 - Obtenir le sommaire d\'un budget qui ne m\'appartient pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get(getRoute(1))
                .expect(404, done);
        });

        test('061004 - Obtenir le sommaire d\'un budget qui n\'existe pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get(getRoute(-1))
                .expect(404, done);
        });
    });

    describe('6.2 - Obtention du sommaire', () => {
        test('062001 - Obtenir sommaire sans type', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get(getRoute(1))
                .expect(200)
                .then((response) => {
                    done();
                });
        });

        test('062002 - Obtenir sommaire avec type invalide', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get(getRoute(1))
                .expect(200)
                .then((response) => {
                    done();
                });
        });
    });
});