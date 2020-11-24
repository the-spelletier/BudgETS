const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const categoryService = require('../services/category');
const cashflowService = require('../services/cashflow');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetCategoriesEstimateCashflows = categoryService.getCategoriesEstimateCashflows;
const stubGetCategoriesEstimateCashflows = sinon.stub(categoryService, 'getCategoriesEstimateCashflows');

const originalGetCategoriesRealCashflows = categoryService.getCategoriesRealCashflows;
const stubGetCategoriesRealCashflows = sinon.stub(categoryService, 'getCategoriesRealCashflows');

const originalAddCashflow = cashflowService.addCashflow;
const stubAddCashflow = sinon.stub(cashflowService, 'addCashflow');

const originalUpdateCashflow = cashflowService.updateCashflow;
const stubUpdateCashflow = sinon.stub(cashflowService, 'updateCashflow');

const app = require('../app.js');
const { put } = require('../app.js');

function getRouteEstimate(budgetId) {
    return '/api/budget/' + budgetId + '/category/cashflow/estimate';
}

function getRouteReal(budgetId) {
    return '/api/budget/' + budgetId + '/category/cashflow/real';
}

function postRoute() {
    return '/api/cashflow/';
}

function putRoute(id) {
    return '/api/cashflow/' + id + '/';
}

function sortBody(body) {
    body.sort((a,b) => (parseInt(a.id) < parseInt(b.id)) ? -1 : ((parseInt(a.id) > parseInt(b.id)) ? 1 : 0));
}

function sortBodyEstimate(body) {
    body.sort((a,b) => (parseInt(a.estimate) < parseInt(b.estimate)) ? -1 : ((parseInt(a.estimate) > parseInt(b.estimate)) ? 1 : 0));
}

describe('10.0 - Cashflows', () => {
    beforeEach(() => {
        auth.verifyAuth.callsFake(originalAuth);
        categoryService.getCategoriesEstimateCashflows.callsFake(originalGetCategoriesEstimateCashflows);
        categoryService.getCategoriesRealCashflows.callsFake(originalGetCategoriesRealCashflows);
        cashflowService.addCashflow.callsFake(originalAddCashflow);
        cashflowService.updateCashflow.callsFake(originalUpdateCashflow);
    });

    describe('10.1 - Obtenir les cashflows', () => {
        test('101001 - Obtenir les cashflows estimés', (done) => {
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
                .get(getRouteEstimate(1))
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(4);
                    expect(response.body[0].id).toEqual('1');
                    expect(response.body[1].id).toEqual('2');
                    expect(response.body[2].id).toEqual('3');
                    expect(response.body[3].id).toEqual('4');
                    done();
                });
        });

        test('101002 - Obtenir les cashflows estimés sans être authentifié', (done) => {
            request(app)
                .get(getRouteEstimate(1))
                .expect(401, done);
        });

        test('101003 - Obtenir les cashflows estimés sans budgetId', (done) => {
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
                .get(getRouteEstimate())
                .expect(404, done);
        });

        test('101004 - Obtenir les cashflows estimés avec budgetId invalide', (done) => {
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
                .get(getRouteEstimate(-1))
                .expect(404, done);
        });

        test('101005 - Obtenir les cashflows estimés d\'un bugdet qui ne m\'appartient pas', (done) => {
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
                .get(getRouteEstimate(5))
                .expect(404, done);
        });

        test('101006 - getCategoriesEstimateCashflows fails', (done) => {
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
            categoryService.getCategoriesEstimateCashflows.callsFake((id, type, groupBy) => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRouteEstimate(1))
                .expect(500, done);
        });

        test('101007 - Obtenir les cashflows estimés des dépenses', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ type: 'expense' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(2);
                    expect(response.body[0].id).toEqual('1');
                    expect(response.body[1].id).toEqual('3');
                    done();
                });
        });

        test('101008 - Obtenir les cashflows estimés des revenus', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ type: 'revenue' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(2);
                    expect(response.body[0].id).toEqual('2');
                    expect(response.body[1].id).toEqual('4');
                    done();
                });
        });

        test('101009 - Obtenir les cashflows estimés groupés par dépenses', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(10);
                    done();
                });
        });

        test('101010 - Obtenir les cashflows estimés groupés par revnus', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ groupBy: 'revenue' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('revenue');
                    expect(response.body[0].cashflows.length).toEqual(10);
                    done();
                });
        });

        test('101011 - Obtenir les cashflows estimés groupés par dépenses ave type dépenses', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ type: 'expense', groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(10);
                    done();
                });
        });

        test('101012 - Obtenir les cashflows estimés groupés par dépenses ave type revenus', (done) => {
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
                .get(getRouteEstimate(1))
                .query({ type: 'revenue', groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(10);
                    done();
                });
        });
        
        test('101013 - Obtenir les cashflows réels', (done) => {
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
                .get(getRouteReal(1))
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(4);
                    expect(response.body[0].id).toEqual('1');
                    expect(response.body[1].id).toEqual('2');
                    expect(response.body[2].id).toEqual('3');
                    expect(response.body[3].id).toEqual('4');
                    done();
                });
        });

        test('101014 - Obtenir les cashflows réels sans être authentifié', (done) => {
            request(app)
                .get(getRouteReal(1))
                .expect(401, done);
        });

        test('101015 - Obtenir les cashflows réels sans budgetId', (done) => {
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
                .get(getRouteReal())
                .expect(404, done);
        });

        test('101016 - Obtenir les cashflows réels avec budgetId invalide', (done) => {
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
                .get(getRouteReal(-1))
                .expect(404, done);
        });

        test('101017 - Obtenir les cashflows réels d\'un bugdet qui ne m\'appartient pas', (done) => {
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
                .get(getRouteReal(5))
                .expect(404, done);
        });

        test('101018 - getCategoriesRealCashflows fails', (done) => {
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
            categoryService.getCategoriesRealCashflows.callsFake((id, type, groupBy) => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRouteReal(1))
                .expect(500, done);
        });

        test('101019 - Obtenir les cashflows réels des dépenses', (done) => {
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
                .get(getRouteReal(1))
                .query({ type: 'expense' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(2);
                    expect(response.body[0].id).toEqual('1');
                    expect(response.body[1].id).toEqual('3');
                    done();
                });
        });

        test('101020 - Obtenir les cashflows réels des revenus', (done) => {
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
                .get(getRouteReal(1))
                .query({ type: 'revenue' })
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(2);
                    expect(response.body[0].id).toEqual('2');
                    expect(response.body[1].id).toEqual('4');
                    done();
                });
        });

        test('101021 - Obtenir les cashflows réels groupés par dépenses', (done) => {
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
                .get(getRouteReal(1))
                .query({ groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(1);
                    done();
                });
        });

        test('101022 - Obtenir les cashflows réels groupés par revnus', (done) => {
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
                .get(getRouteReal(1))
                .query({ groupBy: 'revenue' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('revenue');
                    expect(response.body[0].cashflows.length).toEqual(1);
                    done();
                });
        });

        test('101023 - Obtenir les cashflows réels groupés par dépenses ave type dépenses', (done) => {
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
                .get(getRouteReal(1))
                .query({ type: 'expense', groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(1);
                    done();
                });
        });

        test('101024 - Obtenir les cashflows réels groupés par dépenses ave type revenus', (done) => {
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
                .get(getRouteReal(1))
                .query({ type: 'revenue', groupBy: 'expense' })
                .expect(200)
                .then((response) => {
                    expect(response.body[0].type).toEqual('expense');
                    expect(response.body[0].cashflows.length).toEqual(1);
                    done();
                });
        });
    });

    describe('10.2 - Créer et modifier les cashflows', () => {
        test('102001 - Créer un cashflow estimé', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    month: 1,
                    estimate: 100.00
                })
                .expect(201, done);
        });

        test('102002 - Créer un cashflow estimé sans authentification', (done) => {
            request(app)
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    month: 2,
                    estimate: 100.00
                })
                .expect(401, done);
        });

        test('102003 - Créer un cashflow estimé d\' une catégorie invalide', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: -1,
                    year: 2020,
                    month: 3,
                    estimate: 100.00
                })
                .expect(404, done);
        });

        test('102004 - Créer un cashflow estimé d\'une catégorie qui ne m\'appartient pas', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 65,
                    year: 2020,
                    month: 4,
                    estimate: 100.00
                })
                .expect(404, done);
        });

        test('102005 - Créer un cashflow estimé sans année', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    month: 5,
                    estimate: 100.00
                })
                .expect(400, done);
        });

        test('102006 - Créer un cashflow estimé sans mois', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    estimate: 100.00
                })
                .expect(400, done);
        });

        test('102007 - Créer un cashflow estimé avant début du budget', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2018,
                    month: 1,
                    estimate: 100.00
                })
                .expect(403, done);
        });

        test('102008 - Créer un cashflow estimé après fin du budget', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2022,
                    month: 1,
                    estimate: 100.00
                })
                .expect(403, done);
        });

        test('102009 - Créer un cashflow estimé sans estimé', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    month: 7
                })
                .expect(400, done);
        });

        test('102010 - Créer un cashflow estimé avec estimé nul', (done) => {
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
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    month: 8,
                    estimate: 0.00
                })
                .expect(201, done);
        });

        test('102011 - Créer un cashflow estimé avec BD down', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            cashflowService.addCashflow.callsFake((categoryId, year, month, estimate) => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });


            request(app)
                .post(postRoute())
                .send({
                    categoryId: 9,
                    year: 2020,
                    month: 9,
                    estimate: 100.00
                })
                .expect(403, done);
        });

        test('102012 - Modifier un cashflow estimé', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .put(putRoute(21))
                .send({
                    estimate: 100.00
                })
                .expect(200, done);
        });

        test('102013 - Modifier un cashflow estimé sans authentification', (done) => {
            request(app)
                .put(putRoute(22))
                .send({
                    estimate: 100.00
                })
                .expect(401, done);
        });

        test('102014 - Modifier un cashflow estimé qui ne m\'appartient pas', (done) => {
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
                .put(putRoute(23))
                .send({
                    estimate: 100.00
                })
                .expect(404, done);
        });

        test('102015 - Modifier un cashflow estimé qui n\'existe pas', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .put(putRoute(-1))
                .send({
                    estimate: 100.00
                })
                .expect(404, done);
        });

        test('102016 - Modifier un cashflow estimé sans estimé', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .put(putRoute(25))
                .expect(400, done);
        });

        test('102017 - Modifier un cashflow estimé avec estimé nul', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .put(putRoute(26))
                .send({
                    estimate: 0.00
                })
                .expect(200, done);
        });

        test('102018 - Modifier un cashflow estimé avec BD down', (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the addBudget service
            cashflowService.updateCashflow.callsFake((id, estimate) => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });


            request(app)
                .put(putRoute(27))
                .send({
                    estimate: 100.00
                })
                .expect(403, done);
        });

    });

});