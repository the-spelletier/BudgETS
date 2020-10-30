const request = require('supertest');
const sinon = require('sinon');
const budgetController = require('../controllers/budget');
const { budgetDTO } = require('../dto');

const auth = require('../middlewares/auth');
const budgetService = require('../services/budget');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetLastBudgetsFromDate = budgetService.getLastBudgetsFromDate;
const stubGetLastBudgetsFromDate = sinon.stub(budgetService, 'getLastBudgetsFromDate');

const app = require('../app.js');

function getBudget(id, name, startDate, endDate, isActive, userId) {
    return budgetDTO({
        id: id,
        name: name,
        startdate: startDate,
        endDate: endDate,
        isActive: isActive,
        userId: userId
    })
}

function getRoute(budgetId, count) {
    let route;
    if (budgetId) {
        route = '/api/budget/' + budgetId + '/summary';
    } else {
        route = '/api/budget/summary';
    }

    if (count) {
        route = route + '?count=' + count;
    }

    return route;
}

describe('4.0 - Sommaire', () => {
    beforeEach(() => {
        // Original functions
        auth.verifyAuth.callsFake(originalAuth);
        budgetService.getLastBudgetsFromDate.callsFake(originalGetLastBudgetsFromDate);
    });

    describe('4.1 - Accès à la route', () => {
        test("041001 - Accès à la route sans budget ID au routeur", (done) => {
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
                .get(getRoute())
                .expect(404, done);
        });

        test("041002 - Accès à la route sans budget ID mauvaise route", (done) => {
            app.get(
                '/testsummary',
                auth.verifyAuth,
                budgetController.getSummary
            );
            
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
                .get('/testsummary')
                .expect(400, done);
        });

        test("041003 - Accès à la route avec BD offline", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            budgetService.getLastBudgetsFromDate.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRoute(1))
                .expect(403, done);
        });

        test("041004 - Accès à un budget qui n'existe pas", (done) => {
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

        test("041005 - Accès à un budget qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            budgetService.getLastBudgetsFromDate.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            });


            request(app)
                .get(getRoute(1, 3))
                .expect(404, done);
        });

        test("041006 - Un des budgets précédents est invalide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            budgetService.getLastBudgetsFromDate.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    resolve({
                        currentBudget: getBudget(1, 'testCurrent'),
                        previousBudgets: [getBudget(2, 'test1'), false]
                    });
                });
            });


            request(app)
                .get(getRoute(1, 3))
                .expect(404, done);
        });

    });

    describe('4.2 - Obtenir le sommaire', () => {
        test("042001 - Obtenir sommaire des 5 derniers budget", (done) => {
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
                .get(getRoute(1, 5))
                .expect(200)
                .then((response) => {
                    expect(response.body.currentBudget).not.toBeUndefined();
                    expect(response.body.previousBudgets).not.toBeUndefined();
                    expect(response.body.previousBudgets.length).toEqual(3);
                    response.body.previousBudgets.sort((a,b) => (a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
                    expect(response.body).toEqual({
                        currentBudget: {
                            id: '1',
                            name: 'budgetTest00101',
                            isActive: true,
                            userId: '1',
                            revenue: {
                                real: '40.00',
                                estimate: '4.00'
                            },
                            expense: {
                                real: '40.00',
                                estimate: '2.00'
                            }
                        },
                        previousBudgets: [
                            {
                                id: '2',
                                name: 'budgetTest00102',
                                isActive: false,
                                userId: '1',
                                revenue: {
                                    real: '40.00',
                                    estimate: '8.00'
                                },
                                expense: {
                                    real: '40.00',
                                    estimate: '4.00'
                                }
                            },
                            {
                                id: '3',
                                name: 'budgetTest00103',
                                isActive: false,
                                userId: '1',
                                revenue: {
                                    real: '0.00',
                                    estimate: '0.00'
                                },
                                expense: {
                                    real: '0.00',
                                    estimate: '0.00'
                                }
                            },
                            {
                                id: '4',
                                name: 'budgetTest00104',
                                isActive: false,
                                userId: '1',
                                revenue: {
                                    real: '0.00',
                                    estimate: '0.00'
                                },
                                expense: {
                                    real: '0.00',
                                    estimate: '0.00'
                                }
                            }
                        ]
                    });
                    done();
                });
        });

        test("042002 - Obtenir sommaire des 5 derniers budget sans authentification", (done) => {
            request(app)
                .get(getRoute(1, 5))
                .expect(401, done);
        });

        test("042003 - Obtenir sommaire des 5 derniers budget qui ne m'appartiennent pas", (done) => {
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
                .get(getRoute(1, 5))
                .expect(404, done);
        });

    });

});