const request = require('supertest');
const sinon = require('sinon');
const budgetController = require('../controllers/budget');

const auth = require('../middlewares/auth');
const budgetService = require('../services/budget');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetBudget = budgetService.getBudget;
const stubGetBudget = sinon.stub(budgetService, 'getBudget');

const originalGetBudgets = budgetService.getBudgets;
const stubGetBudgets = sinon.stub(budgetService, 'getBudgets');

const originalAddBudget = budgetService.addBudget;
const stubAddBudget = sinon.stub(budgetService, 'addBudget');

const originalUpdateUser = userService.updateUser;
const stubUpdateUser = sinon.stub(userService, 'updateUser');

const originalGetUserActiveBudget = userService.getUserActiveBudget;
const stubGetUserActiveBudget = sinon.stub(userService, 'getUserActiveBudget');


const app = require('../app.js');

describe('2.0 - Budget', () => {
    beforeEach(() => {
        // Original functions
        auth.verifyAuth.callsFake(originalAuth);
        budgetService.getBudget.callsFake(originalGetBudget);
        budgetService.getBudgets.callsFake(originalGetBudgets);
        budgetService.addBudget.callsFake(originalAddBudget);
        userService.updateUser.callsFake(originalUpdateUser);
        userService.getUserActiveBudget.callsFake(originalGetUserActiveBudget);
    });

    describe('2.1 - Créer un nouveau budget', () => {
        test("021001 - Création d'un nouveau budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create',
                    startDate: start,
                    endDate: end
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: 'budgetTest_create',
                            startDate: start,
                            endDate: end,
                            userId: '1'
                        })
                    );
                    done();
                });
            
        });
        
        test("021002 - Création sans authentification", (done) => {
            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create2',
                    startDate: start,
                    endDate: end
                })
                .expect(401, done);
            
        });
        
        test("021003 - Manque le nom du budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
            
        });
        
        test("021004 - Manque la date de début", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create4',
                    endDate: end
                })
                .expect(400, done);
            
        });
        
        test("021005 - Manque la date de fin", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create5',
                    startDate: start
                })
                .expect(400, done);
            
        });
        
        test("021006 - Nom budget vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: '',
                    startDate: start,
                    endDate: end
                })
                .expect(400, done);
        });
        
        test("021007 - Date début plus grand que fin", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create7',
                    startDate: end,
                    endDate: start
                })
                .expect(400, done);
            
        });
    
        test("021008 - Création d'un nouveau budget avec BD offline", (done) => {
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
            budgetService.addBudget.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            const start = new Date(2020, 0, 1).toJSON();
            const end = new Date(2020, 11, 31).toJSON();

            request(app)
                .post('/api/budget')
                .send({
                    name: 'budgetTest_create8',
                    startDate: start,
                    endDate: end,
                    isActive: true
                })
                .expect(403, done);
        });

    });

    describe('2.2 - Consulter le dernier budget', () => {
        test("022001 - Consultation du dernier budget", (done) => {
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
                .get('/api/budget/current')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '5',
                            name: 'budgetTest00201',
                            startDate: new Date(2020, 0, 1).toJSON(),
                            endDate: new Date(2020, 11, 31).toJSON(),
                            userId: '2'
                        })
                    );
                    done();
                });
            
        });
        
        test("022002 - Dernier budget sans authentification", (done) => {
            request(app)
                .get('/api/budget/current')
                .expect(401, done);
            
        });
    
        test("022003 - Consultation du dernier budget avec BD offline", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the getBudget service
            userService.getUserActiveBudget.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get('/api/budget/current')
                .expect(403, done);
            
        });

    });

    describe('2.3 - Consulter un budget', () => {
        test("023001 - Obtenir la liste de tous les budgets", (done) => {
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
                .get('/api/budget/')
                .expect(200)
                .then((response) => {
                    expect(response.body.length).toEqual(4);
                    response.body.sort((a,b) => (a.id < b.id) ? -1 : 1);
                    for (let i = 0; i < response.body.length; ++i) {
                        const active = (i == 0);
                        delete response.body[i].endDate;
                        delete response.body[i].startDate;
                        delete response.body[i].shortName;
                        expect(response.body).toContainEqual({
                                id: (5 + i).toString(),
                                name: 'budgetTest002' + ("0" + (i + 1)).slice(-2),
                                userId: '2'
                        });
                    }
                    done();
                });
            
        });
        
        test("023002 - Tous les budgets sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            request(app)
                .get('/api/budget')
                .expect(401, done);
            
        });
        
        test("023003 - Obtenir un budget en particulier", (done) => {
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
                .get('/api/budget/2')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '2',
                            name: 'budgetTest00102',
                            startDate: new Date(2019, 0, 1).toJSON(),
                            endDate: new Date(2019, 11, 31).toJSON(),
                            userId: '1'
                        })
                    );
                    done();
                });
            
        });
        
        test("023004 - Obtenir un budget qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test009'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get('/api/budget/6')
                .expect(404, done);
            
        });
        
        test("023005 - Obtenir un budget sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            request(app)
                .get('/api/budget/1')
                .expect(401, done);
            
        });
        
        test("023006 - Obtenir un budget qui n'existe pas", (done) => {
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
                .get('/api/budget/-1')
                .expect(404, done);
            
        });

        test("023007 - Obtenir la liste de tous les budgets avec BD offline", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the getBudgets service
            budgetService.getBudgets.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get('/api/budget/')
                .expect(403, done);
            
        });

        test("023008 - Obtenir un budget en particulier avec BD offline", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            // Stub the resetGetActiveBudget service
            userService.updateUser.callsFake(budget => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get('/api/budget/1')
                .expect(403, done);
            
        });

    });

    describe('2.4 - Modifier un budget', () => {
        
        test("024001 - Mets à jour les champs d'un budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/11')
                .send({
                    name: 'budgetTest_updated1',
                    startDate: start,
                    endDate: end
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '11',
                            name: 'budgetTest_updated1',
                            startDate: start,
                            endDate: end,
                            userId: '3'
                        })
                    );
                    done();
                });
            
        });
        
        test("024002 - Date début plus grand que fin", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/12')
                .send({
                    name: 'budgetTest_updated2',
                    startDate: end,
                    endDate: start
                })
                .expect(403, done);
            
        });
        
        test("024003 - Mets à jour sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/3')
                .send({
                    name: 'budgetTest_updated3',
                    startDate: start,
                    endDate: end
                })
                .expect(401, done);
            
        });
        
        test("024004 - Mets à jour budget qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test001'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/11')
                .send({
                    name: 'budgetTest_updated4',
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
            
        });
        
        test("024005 - Mets à jour budget qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/-1')
                .send({
                    name: 'budgetTest_updated5',
                    startDate: start,
                    endDate: end
                })
                .expect(404, done);
            
        });

        test("024006 - Mets à jour budget sans id", (done) => {
            app.put(
                '/api/budget/',
                auth.verifyAuth,
                budgetController.update
            );

            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/')
                .send({
                    name: 'budgetTest_updated6',
                    startDate: start,
                    endDate: end,
                    isActive: false
                })
                .expect(400, done);
            
        });
    });
});
