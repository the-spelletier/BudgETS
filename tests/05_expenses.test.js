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

describe('5.0 - Sommaire des dépenses', () => {
    beforeEach(() => {
        auth.verifyAuth.callsFake(originalAuth);
    });

    describe('5.1 - Accès au sommaire', () => {
        test('051001 - Obtenir le sommaire', (done) => {
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
                .query({ type: 'expense' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(resonse.body.length).toEqual(2);
                    done();
                });
        });

        /*test('051002 - Obtenir le sommaire sans authentification', (done) => {
            request(app)
                .get(getRoute(1))
                .expect(401, done);
        });

        test('051003 - Obtenir le sommaire d\'un budget qui ne m\'appartient pas', (done) => {
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

        test('051004 - Obtenir le sommaire d\'un budget qui n\'existe pas', (done) => {
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
    */});

    /*describe('5.2 - Obtention du sommaire', () => {
        test('052001 - Obtenir sommaire sans type', (done) => {
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

        test('052002 - Obtenir sommaire avec type invalide', (done) => {
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
    });*/

});