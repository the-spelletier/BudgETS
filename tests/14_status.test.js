const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const statusController = require('../controllers/entryStatus');

const { User } = require('../models');
const userService = require('../services/user');
const statusService = require('../services/entryStatus');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetStatus = statusService.getStatus;
const stubGetStatus = sinon.stub(statusService, 'getStatus');

const originalGetStatuses = statusService.getStatuses;
const stubGetStatuses = sinon.stub(statusService, 'getStatuses');

const originalDeleteStatus = statusService.deleteStatus;
const stubDeleteStatus = sinon.stub(statusService, 'deleteStatus');

const app = require('../app.js');

function getRouteStatus(statusId) {
    if (statusId) {
        return '/api/status/' + statusId + "/"
    } else {
        return '/api/status/'
    }
}

function getRouteByBudget(budgetId) {
    return '/api/budget/' + budgetId +'/status/';
}

function stubbedAuth(username) {
    // Stub the verifyAuth
    auth.verifyAuth.callsFake((req, res, next) => {
        userService.getUser({
            username: username
        }).then(user => {
            req.user = User.build(user, {raw: true});
            next();
        })
    });
}

describe('14.0 - Statuts', () => {
    beforeEach(() => {
        // Restore original stubs
        auth.verifyAuth.callsFake(originalAuth);
        statusService.getStatus.callsFake(originalGetStatus);
        statusService.getStatuses.callsFake(originalGetStatuses);
        statusService.deleteStatus.callsFake(originalDeleteStatus);
    });

    describe('14.1 - Obtenir statut', () => {
        test("141001 - Obtenir un statut", (done) => {
            stubbedAuth('budgets_test001')

            request(app)
                .get(getRouteStatus(1))
                .expect(200)
                .then((response) => {
                    expect(response.body.id).toEqual('1');
                    done();
                });
        });

        test("141002 - Obtenir un statut sans authentification", (done) => {
            //stubbedAuth('budgets_test001')

            request(app)
                .get(getRouteStatus(1))
                .expect(401, done);
        });

        test("141003 - Obtenir un statut avec BD down", (done) => {
            stubbedAuth('budgets_test001')

            // Stub the service
            statusService.getStatus.callsFake(statusID => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRouteStatus(1))
                .expect(500, done);
        });

        test("141004 - Obtenir les statuts d'un budget", (done) => {
            stubbedAuth('budgets_test001')

            request(app)
                .get(getRouteByBudget(1))
                .expect(200)
                .then((response) => {
                    response.body.sort((a,b) => (a.id < b.id) ? -1 : 1);
                    expect(response.body.length).toEqual(3);
                    expect(response.body[0].id).toEqual('1');
                    expect(response.body[1].id).toEqual('2');
                    expect(response.body[2].id).toEqual('3');
                    done();
                });
        });

        test("141005 - Obtenir les statuts d'un budget sans authentification", (done) => {
            //stubbedAuth('budgets_test001')

            request(app)
                .get(getRouteByBudget(1))
                .expect(401, done);
        });

        test("141006 - Obtenir les statuts d'un budget avec BD down", (done) => {
            stubbedAuth('budgets_test001')

            // Stub the service
            statusService.getStatuses.callsFake(budgetID => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRouteByBudget(1))
                .expect(500, done);
        });

    });

    describe('14.2 - Créer statut', () => {
        test("142001 - Créer un statut", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test1',
                    position: 1,
                    budgetId: 5
                })
                .expect(201, done);
        });

        test("142002 - Créer un statut sans authentification", (done) => {
            //stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test2',
                    position: 1,
                    budgetId: 5
                })
                .expect(401, done);
        });

        test("142003 - Créer un statut sans nom", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    position: 1,
                    budgetId: 5
                })
                .expect(400, done);
        });

        test("142004 - Créer un statut avec nom vide", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: '',
                    position: 1,
                    budgetId: 5
                })
                .expect(400, done);
        });

        test("142005 - Créer un statut sans position", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test5',
                    budgetId: 5
                })
                .expect(400, done);
        });

        test("142006 - Créer un statut avec position nulle", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test6',
                    position: 0,
                    budgetId: 5
                })
                .expect(400, done);
        });

        test("142007 - Créer un statut sans budgetId", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test7',
                    position: 1,
                })
                .expect(400, done);
        });

        test("142008 - Créer un statut avec budgetId qui n'existe pas", (done) => {
            stubbedAuth('budgets_test002')

            request(app)
                .post(getRouteStatus())
                .send({
                    name: 'test8',
                    position: 1,
                    budgetId: -1
                })
                .expect(403, done);
        });

    });

    describe('14.3 - Modifier statut', () => {
        test("143001 - Modifier un statut", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(301))
                .send({
                    name: 'test1',
                    position: 5
                })
                .expect(200, done);
        });

        test("143002 - Modifier un statut sans authentification", (done) => {
            //stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(302))
                .send({
                    name: 'test2',
                    position: 5
                })
                .expect(401, done);
        });

        test("143003 - Modifier un statut sans statusId", (done) => {
            stubbedAuth('budgets_test003')

            app.put(
                '/api/status/test/test',
                auth.verifyAuth,
                statusController.update
            );

            request(app)
                .put('/api/status/test/test')
                .send({
                    name: 'test3',
                    position: 5
                })
                .expect(400, done);
        });

        test("143004 - Modifier un statut sans nom", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(304))
                .send({
                    position: 5
                })
                .expect(400, done);
        });

        test("143005 - Modifier un statut avec nom vide", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(305))
                .send({
                    name: '',
                    position: 5
                })
                .expect(400, done);
        });

        test("143006 - Modifier un statut sans position", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(306))
                .send({
                    name: 'test6',
                })
                .expect(400, done);
        });

        test("143007 - Modifier un statut avec position nulle", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(307))
                .send({
                    name: 'test7',
                    position: 0
                })
                .expect(400, done);
        });

        test("143008 - Modifier un statut avec budgetId qui n'existe pas", (done) => {
            stubbedAuth('budgets_test003')

            request(app)
                .put(getRouteStatus(308))
                .send({
                    name: 'test8',
                    position: 5,
                    budgetId: -1
                })
                .expect(403, done);
        });

    });

    describe('14.4 - Supprimer statut', () => {
        test("144001 - Supprimer un statut", (done) => {
            stubbedAuth('budgets_test004')

            request(app)
                .delete(getRouteStatus(401))
                .expect(204,done);
        });

        test("144002 - Supprimer un statut sans authentification", (done) => {
            //stubbedAuth('budgets_test004')

            request(app)
                .delete(getRouteStatus(402))
                .expect(401,done);
        });

        test("144003 - Supprimer un statut sans statusId", (done) => {
            stubbedAuth('budgets_test004')

            app.delete(
                '/api/status/test/test',
                auth.verifyAuth,
                statusController.deleteOne
            );

            request(app)
                .delete('/api/status/test/test')
                .expect(400,done);
        });

        test("144004 - Supprimer un statut avec BD down", (done) => {
            stubbedAuth('budgets_test004')

            // Stub the service
            statusService.deleteStatus.callsFake(statusID => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .delete(getRouteStatus(404))
                .expect(403,done);
        });

        test("144005 - Supprimer un statut sans avoir trouver le statut", (done) => {
            stubbedAuth('budgets_test004')

            // Stub the service
            statusService.deleteStatus.callsFake(statusID => {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            });

            request(app)
                .delete(getRouteStatus(405))
                .expect(404,done);
        });

    });

});