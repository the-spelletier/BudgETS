const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');


const accessController = require('../controllers/access');

const { User } = require('../models');
const userService = require('../services/user');
const accessService = require('../services/access');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetAccesses = accessService.getAccesses;
const stubGetAccesses = sinon.stub(accessService, 'getAccesses');

const originalDeleteAccess = accessService.deleteAccess;
const stubDeleteAccess = sinon.stub(accessService, 'deleteAccess');

const app = require('../app.js');

function getRouteByUser() {
    return '/api/user/access/';
}

function getRouteByBudget(budgetId) {
    return '/api/budget/' + budgetId + '/access/';
}

function getRouteByBudgetByUser(budgetId, userId) {
    return '/api/budget/' + budgetId + '/access/' + userId + '/';
}

function stubAuthAccesses(username) {
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

describe('12.0 - Accès', () => {
    beforeEach(() => {
        // Restore original stubs
        auth.verifyAuth.callsFake(originalAuth);
        accessService.getAccesses.callsFake(originalGetAccesses);
        accessService.deleteAccess.callsFake(originalDeleteAccess);
    });

    describe('12.1 - Obtenir les accès', () => {
        describe('Par utilisateur', () => {
            test("121001 - Obtenir les accès d'un utilisateur", (done) => {
                stubAuthAccesses('budgets_test001')
    
                request(app)
                    .get(getRouteByUser())
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(36);
                        done();
                    });
            });

            test("121002 - Obtenir les accès d'un utilisateur non connecté", (done) => {
                // Pas de connexion
                //stubAuthAccesses('budgets_test001')
    
                request(app)
                    .get(getRouteByUser())
                    .expect(401, done);
            });

            test("121003 - Obtenir les accès d'un utilisateur avec BD down", (done) => {
                stubAuthAccesses('budgets_test001')
    
                // Stub the addBudget service
                accessService.getAccesses.callsFake(budgId => {
                    return new Promise((resolve, reject) => {
                        reject('DB down');
                    });
                });

                request(app)
                    .get(getRouteByUser())
                    .expect(500, done);
            });
        });

        describe('Par budget', () => {
            test("121004 - Obtenir les accès d'un budget", (done) => {
                stubAuthAccesses('budgets_test001')
    
                request(app)
                    .get(getRouteByBudget(1))
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(2);
                        done();
                    });
            });

            test("121005 - Obtenir les accès d'un budget sans authentification", (done) => {
                //stubAuthAccesses('budgets_test001')
    
                request(app)
                    .get(getRouteByBudget(1))
                    .expect(401, done);
            });

            test("121006 - Obtenir les accès d'un budget dont je ne suis pas le owner", (done) => {
                stubAuthAccesses('budgets_test010')
    
                request(app)
                    .get(getRouteByBudget(1))
                    .expect(404, done);
            });

            test("121007 - Obtenir les accès d'un budget qui n'existe pas", (done) => {
                stubAuthAccesses('budgets_test001')
    
                request(app)
                    .get(getRouteByBudget(-1))
                    .expect(404, done);
            });

            test("121008 - Obtenir les accès d'un budget avec BD down", (done) => {
                stubAuthAccesses('budgets_test001')
    
                // Stub
                accessService.getAccesses.callsFake(budgId => {
                    return new Promise((resolve, reject) => {
                        reject('DB down');
                    });
                });

                request(app)
                    .get(getRouteByBudget(1))
                    .expect(500, done);
            });

        });
    });

    describe('12.2 - Créer des accès', () => {
        test("122001 - Créer un accès", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(2))
                .send({ userId: 10 })
                .expect(201)
                .then((response) => {
                    expect(response.body).toEqual({
                        budgetId: '2',
                        userId: 10
                    })
                    done();
                });
        });

        test("122002 - Créer un accès sans authentification", (done) => {
            //stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(2))
                .send({ userId: 11 })
                .expect(401, done)
        });

        test("122003 - Créer un accès d'un budget dont je ne suis pas le owner", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(5))
                .send({ userId: 12 })
                .expect(404, done);
        });

        test("122004 - Créer un accès d'un budget qui n'existe pas", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(-1))
                .send({ userId: 10 })
                .expect(404, done);
        });

        test("122005 - Créer un accès sans userId", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(2))
                .expect(400, done);
        });

        test("122006 - Créer un accès aec userId invalide", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .post(getRouteByBudget(2))
                .send({ userId: -1 })
                .expect(403, done);
        });

        test("122007 - Créer un accès sans budgetId", (done) => {
            stubAuthAccesses('budgets_test001')

            app.post(
                '/api/buget/test/access/',
                auth.verifyAuth,
                accessController.create
            );

            request(app)
                .post('/api/buget/test/access/')
                .send({ userId: 10 })
                .expect(400, done);
        });

    });

    describe('12.3 - Supprimer des accès', () => {
        test("123001 - Supprimer un accès d'un user d'un budget", (done) => {
            stubAuthAccesses('budgets_test003')

            request(app)
                .delete(getRouteByBudgetByUser(9, 10))
                .expect(204, done);
        });

        test("123002 - Supprimer un accès d'un user d'un budget sans authentification", (done) => {
            //stubAuthAccesses('budgets_test003')

            request(app)
                .delete(getRouteByBudgetByUser(9, 11))
                .expect(401, done);
        });

        test("123003 - Supprimer un accès d'un user d'un budget dont je ne suis pas le owner", (done) => {
            stubAuthAccesses('budgets_test001')

            request(app)
                .delete(getRouteByBudgetByUser(9, 12))
                .expect(404, done);
        });

        test("123004 - Supprimer un accès d'un user d'un budget qui n'existe pas", (done) => {
            stubAuthAccesses('budgets_test003')

            request(app)
                .delete(getRouteByBudgetByUser(-1, 13))
                .expect(404, done);
        });

        test("123005 - Supprimer un accès d'un user d'un budget sans budgetId", (done) => {
            stubAuthAccesses('budgets_test003')

            app.delete(
                '/api/budget/access/:userId/test',
                auth.verifyAuth,
                accessController.deleteOne
            );

            request(app)
                .delete('/api/budget/access/14/test')
                .expect(400, done);
        });

        test("123006 - Supprimer un accès d'un user d'un budget sans userId", (done) => {
            stubAuthAccesses('budgets_test003')

            app.delete(
                '/api/budget/test/:budgetId',
                auth.verifyAuth,
                accessController.deleteOne
            );

            request(app)
                .delete('/api/budget/test/12')
                .expect(400, done);
        });

        test("123007 - Supprimer un accès d'un user d'un budget avec userId invalide", (done) => {
            stubAuthAccesses('budgets_test003')

            request(app)
                .delete(getRouteByBudgetByUser(9, -1))
                .expect(403, done);
        });

        test("123008 - Supprimer un accès d'un user d'un budget avec un accès qui n'existe pas", (done) => {
            stubAuthAccesses('budgets_test003')

            request(app)
                .delete(getRouteByBudgetByUser(9, 9))
                .expect(404, done);
        });

        test("123009 - Supprimer un accès d'un user d'un budget avec deleteAccess fail", (done) => {
            stubAuthAccesses('budgets_test003')

            // Stub
            accessService.deleteAccess.callsFake((budgetId, userId) => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .delete(getRouteByBudgetByUser(9, 15))
                .expect(403, done);
        });
    });

});