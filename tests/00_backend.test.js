const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');
const accessMiddleware = require('../middlewares/access');
const config = require('../config/jsonConfig');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const userService = require('../services/user');

const accessService = require('../services/access');
const budgetService = require('../services/budget');
const categoryService = require('../services/category');
const entryService = require('../services/entry');
const lineService = require('../services/line');
const cashflowService = require('../services/cashflow');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetAccesses = accessService.getAccesses
const stubGetAccesses = sinon.stub(accessService, 'getAccesses');

const originalGetBudget = budgetService.getBudget;
const stubGetBudget = sinon.stub(budgetService, 'getBudget');

const originalGetCategory = categoryService.getCategory;
const stubGetCategory = sinon.stub(categoryService, 'getCategory');

const originalGetEntry = entryService.getEntry;
const stubGetEntry = sinon.stub(entryService, 'getEntry');

const originalGetLine = lineService.getLine;
const stubGetLine = sinon.stub(lineService, 'getLine');

const originalGetCashflow = cashflowService.getCashflow;
const stubGetCashflow = sinon.stub(cashflowService, 'getCashflow');

const app = require('../app.js');

describe('0.0 - Backend', () => {
    beforeEach(() => {
        auth.verifyAuth.callsFake(originalAuth);
        accessService.getAccesses.callsFake(originalGetAccesses);
        budgetService.getBudget.callsFake(originalGetBudget);
        categoryService.getCategory.callsFake(originalGetCategory);
        entryService.getEntry.callsFake(originalGetEntry);
        lineService.getLine.callsFake(originalGetLine);
        cashflowService.getCashflow.callsFake(originalGetCashflow);
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
            request(app).get('/api/category/1').expect(404, done)
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

    describe('0.2 - Middleware authentification', () => {
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

    describe('0.3 - Middleware access', () => {
        describe('Validate Budget', () => {
            beforeEach(() => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = { budgetId: 1 };
                    next();
                });

                app.get(
                    '/testValidateBudget',
                    [auth.verifyAuth, accessMiddleware.hasBudgetAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003001 - Validate Budget - Get Budget Fails', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        reject();
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(404, done);
            });
    
            test('003002 - Validate Budget - No budget returned', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(404, done);
            });
    
            test('003003 - Validate Budget - UserId = reqUserId', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(200, done);
            });
    
            test('003004 - Validate Budget - Check Owner', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 2
                        });
                    });
                });
    
                app.get(
                    '/testValidateBudgetOwner',
                    [auth.verifyAuth, accessMiddleware.isBudgetOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
    
                request(app)
                    .get('/testValidateBudgetOwner')
                    .expect(404, done);
            });
    
            test('003005 - Validate Budget - No accesses', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 2
                        });
                    });
                });
    
                // Stub the getAccesses
                accessService.getAccesses.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(404, done);
            });
    
            test('003006 - Validate Budget - Access but not for user', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 2
                        });
                    });
                });
    
                // Stub the getAccesses
                accessService.getAccesses.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve([
                            {
                                budgetId: 1,
                                userId: 99
                            },
                            {
                                budgetId: 1,
                                userId: 98
                            }
                        ]);
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(404, done);
            });
    
            test('003007 - Validate Budget - Found access for user', (done) => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 2
                        });
                    });
                });
    
                // Stub the getAccesses
                accessService.getAccesses.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve([
                            {
                                budgetId: 1,
                                userId: 99
                            },
                            {
                                budgetId: 1,
                                userId: 1
                            }
                        ]);
                    });
                });
    
                request(app)
                    .get('/testValidateBudget')
                    .expect(200, done);
            });
    
        });
        
        describe('Validate Category', () => {
            beforeEach(() => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1
                    };
                    next();
                });

                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                app.get(
                    '/testValidateCategory',
                    [auth.verifyAuth, accessMiddleware.hasCategoryAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003008 - Validate Category - Get Category Fails', (done) => {
                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        reject();
                    });
                });
    
                request(app)
                    .get('/testValidateCategory')
                    .expect(404, done);
            });

            test('003009 - Validate Category - No category returned', (done) => {
                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateCategory')
                    .expect(404, done);
            });

            test('003010 - Validate Category - Good category', (done) => {
                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });
    
                request(app)
                    .get('/testValidateCategory')
                    .expect(200, done);
            });
        });
        
        describe('Validate Line', () => {
            beforeEach(() => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1
                    };
                    next();
                });

                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testValidateLine',
                    [auth.verifyAuth, accessMiddleware.hasLineAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003011 - Validate Line - Get Line fails', (done) => {
                // Stub the getLine
                lineService.getLine.callsFake(line => {
                    return new Promise((resolve, reject) => {
                        reject();
                    });
                });
    
                request(app)
                    .get('/testValidateLine')
                    .expect(404, done);
            });

            test('003012 - Validate Line - No line returned', (done) => {
                // Stub the getLine
                lineService.getLine.callsFake(line => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateLine')
                    .expect(404, done);
            });

            test('003013 - Validate Line - Good line', (done) => {
                // Stub the getLine
                lineService.getLine.callsFake(line => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });
    
                request(app)
                    .get('/testValidateLine')
                    .expect(200, done);
            });
        });

        describe('Validate Entry', () => {
            beforeEach(() => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testValidateEntry',
                    [auth.verifyAuth, accessMiddleware.hasEntryAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003014 - Validate Entry - Get Entry fails', (done) => {
                // Stub the getEntry
                entryService.getEntry.callsFake(entry => {
                    return new Promise((resolve, reject) => {
                        reject();
                    });
                });
    
                request(app)
                    .get('/testValidateEntry')
                    .expect(404, done);
            });

            test('003015 - Validate Entry - No entry returned', (done) => {
                // Stub the getEntry
                entryService.getEntry.callsFake(entry => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateEntry')
                    .expect(404, done);
            });

            test('003016 - Validate Entry - Good entry', (done) => {
                // Stub the getEntry
                entryService.getEntry.callsFake(entry => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });
    
                request(app)
                    .get('/testValidateEntry')
                    .expect(200, done);
            });
        });

        describe('Has Budget Access', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testHasBudgetAccess',
                    [auth.verifyAuth, accessMiddleware.hasBudgetAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003017 - Has Budget Access - No user Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { test: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasBudgetAccess')
                    .expect(400, done);
            });

            test('003018 - Has Budget Access - No budget Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasBudgetAccess')
                    .expect(200, done);
            });

            test('003019 - Has Budget Access - Good credentials', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasBudgetAccess')
                    .expect(200, done);
            });
        });

        describe('Is Budget Owner', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testIsBudgetOwner',
                    [auth.verifyAuth, accessMiddleware.isBudgetOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003020 - Is Budget Owner - Should pass', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testIsBudgetOwner')
                    .expect(200, done);
            });
        });

        describe('Has Category Access', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testHasCategoryAccess',
                    [auth.verifyAuth, accessMiddleware.hasCategoryAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003021 - Has Category Access - No user Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { test: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasCategoryAccess')
                    .expect(400, done);
            });

            test('003022 - Has Category Access - No category id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasCategoryAccess')
                    .expect(200, done);
            });

            test('003023 - Has Category Access - Good credentials', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasCategoryAccess')
                    .expect(200, done);
            });
        });

        describe('Is Category Owner', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testIsCategoryOwner',
                    [auth.verifyAuth, accessMiddleware.isCategoryOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003024 - Is Category Owner - Should pass', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testIsCategoryOwner')
                    .expect(200, done);
            });
        });

        describe('Has Line Access', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testHasLineAccess',
                    [auth.verifyAuth, accessMiddleware.hasLineAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003025 - Has Line Access - No user Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { test: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasLineAccess')
                    .expect(400, done);
            });

            test('003026 - Has Line Access - No Line id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasLineAccess')
                    .expect(200, done);
            });

            test('003027 - Has Line Access - Good credentials', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasLineAccess')
                    .expect(200, done);
            });
        });

        describe('Is Line Owner', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testIsLineOwner',
                    [auth.verifyAuth, accessMiddleware.isLineOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003028 - Is Line Owner - Should pass', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testIsLineOwner')
                    .expect(200, done);
            });
        });

        describe('Has Entry Access', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testHasEntryAccess',
                    [auth.verifyAuth, accessMiddleware.hasEntryAccess],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003029 - Has Entry Access - No user Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { test: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasEntryAccess')
                    .expect(400, done);
            });

            test('003030 - Has Entry Access - No Entry id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasEntryAccess')
                    .expect(200, done);
            });

            test('003031 - Has Entry Access - Good credentials', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testHasEntryAccess')
                    .expect(200, done);
            });
        });

        describe('Is Entry Owner', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                // Stub the getLine
                lineService.getLine.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testIsEntryOwner',
                    [auth.verifyAuth, accessMiddleware.isEntryOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003032 - Is Entry Owner - Should pass', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        lineId: 1,
                        entryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testIsEntryOwner')
                    .expect(200, done);
            });
        });

        describe('Validate Cashflow', () => {
            beforeEach(() => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        cashflowId: 1
                    };
                    next();
                });

                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testValidateCashflow',
                    [auth.verifyAuth, accessMiddleware.isCashflowOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003033 - Validate Cashflow - Get Cashflow fails', (done) => {
                // Stub the getCashflow
                cashflowService.getCashflow.callsFake(cashflow => {
                    return new Promise((resolve, reject) => {
                        reject();
                    });
                });
    
                request(app)
                    .get('/testValidateCashflow')
                    .expect(404, done);
            });

            test('003034 - Validate Cashflow - No cashflow returned', (done) => {
                // Stub the getCashflow
                cashflowService.getCashflow.callsFake(cashflow => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
    
                request(app)
                    .get('/testValidateCashflow')
                    .expect(404, done);
            });

            test('003035 - Validate Cashflow - Good cashflow', (done) => {
                // Stub the getCashflow
                cashflowService.getCashflow.callsFake(cashflow => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });
    
                request(app)
                    .get('/testValidateCashflow')
                    .expect(200, done);
            });
        });

        describe('Is Cashflow Owner', () => {
            beforeEach(() => {
                // Stub the getBudget
                budgetService.getBudget.callsFake(budget => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: 1
                        });
                    });
                });

                // Stub the getCategory
                categoryService.getCategory.callsFake(category => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: 1
                        });
                    });
                });

                app.get(
                    '/testCashflowOwner',
                    [auth.verifyAuth, accessMiddleware.isCashflowOwner],
                    function (req, res) {
                        res.status(200);
                        res.send();
                    }
                );
            });

            test('003036 - Is Cashflow Owner - No user Id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { test: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        cashflowId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testCashflowOwner')
                    .expect(400, done);
            });

            test('003037 - Is Cashflow Owner - No Cashflow id', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testCashflowOwner')
                    .expect(200, done);
            });

            test('003038 - Is Cashflow Owner - Good credentials', (done) => {
                // Stub the verifyAuth
                auth.verifyAuth.callsFake((req, res, next) => {
                    req.user = { id: 1 };
                    req.params = {
                        budgetId: 1,
                        categoryId: 1,
                        cashflowId: 1
                    };
                    next();
                });

                request(app)
                    .get('/testCashflowOwner')
                    .expect(200, done);
            });
        });
    });
});
