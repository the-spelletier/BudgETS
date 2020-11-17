const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

describe('3.0 - Catégories et lignes', () => {
    describe('3.1 - Obtenir catégories et lignes', () => {
        describe('3.1.1 - Obtenir catégories', () => {
            test("031001 - Obtenir toutes les catégories d'un budget", (done) => {
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
                    .get('/api/budget/2/category')
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(4);
                        response.body.sort((a,b) => (a.id < b.id) ? -1 : 1);
                        for (let i = 0; i < response.body.length; ++i) {
                            const typeStr = ((5 + i) % 2 == 0) ? 'revenue' : 'expense';
                            expect(response.body[i]).toEqual(
                                expect.objectContaining({
                                    id: (5 + i).toString(),
                                    name: 'categoryTest02' + ("0" + (i + 1)).slice(-2),
                                    type: typeStr,
                                    budgetId: '2'
                                })
                            );
                        }
                        done();
                    });
            });

            test("031002 - Obtenir toutes les catégories d'un budget sans authentification", (done) => {
                // Original authentification service
                auth.verifyAuth.callsFake(originalAuth);
    
                request(app)
                    .get('/api/budget/2/category')
                    .expect(401, done);
                
            });

            test("031003 - Obtenir toutes les catégories d'un budget qui ne m'appartient pas", (done) => {
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
                    .get('/api/budget/6/category')
                    .expect(404, done);
                
            });

            test("031004 - Obtenir toutes les catégories d'un budget qui n'existe pas", (done) => {
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
                    .get('/api/budget/-1/category')
                    .expect(404, done);
                
            });
        
            test("031005 - Obtenir toutes les catégories d'un budget (Version light)", (done) => {
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
                    .get('/api/budget/2/category?light')
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(4);
                        for (let i = 0; i < response.body.length; ++i) {
                            const typeStr = ((5 + i) % 2 == 0) ? 'revenue' : 'expense';
                            expect(response.body[i]['lines']).toBeUndefined();
                            expect(response.body[i]).toEqual(
                                expect.objectContaining({
                                    id: (5 + i).toString(),
                                    name: 'categoryTest02' + ("0" + (i + 1)).slice(-2),
                                    type: typeStr,
                                    budgetId: '2'
                                })
                                    
                            );
                        }
                        done();
                    });
            });

            test("031006 - Obtenir toutes les catégories d'un budget sans authentification (Version light)", (done) => {
                // Original authentification service
                auth.verifyAuth.callsFake(originalAuth);
    
                request(app)
                    .get('/api/budget/2/category?light')
                    .expect(401, done);
                
            });

            test("031007 - Obtenir toutes les catégories d'un budget qui ne m'appartient pas (Version light)", (done) => {
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
                    .get('/api/budget/6/category?light')
                    .expect(404, done);
            });

            test("031008 - Obtenir toutes les catégories d'un budget qui n'existe pas (Version light)", (done) => {
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
                    .get('/api/budget/-1/category?light')
                    .expect(404, done);
                
            });
        
        });

        describe('3.1.2 - Obtenir lignes', () => {
            test("031009 - Obtenir toutes les lignes d'une catégorie", (done) => {
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
                    .get('/api/category/2/line')
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(4);
                        for (let i = 0; i < response.body.length; ++i) {
                            //const sign = ((5 + i) % 2 == 0) ? 1 : -1
                            expect(response.body[i]).toEqual(
                                expect.objectContaining({
                                    id: (5 + i).toString(),
                                    name: 'lineTest02' + ("0" + (i + 1)).slice(-2)/*, // unused fields?
                                    description: (5 + i).toString(),
                                    categoryId: '2',
                                    estimate: sign * (i + 1)*/
                                })
                            );
                        }
                        done();
                    });
            });

            test("031010 - Obtenir toutes les lignes d'une catégorie sans authentification", (done) => {
                // Original authentification service
                auth.verifyAuth.callsFake(originalAuth);
    
                request(app)
                    .get('/api/category/2/line')
                    .expect(401, done);
                
            });

            test("031011 - Obtenir toutes les lignes d'une catégorie qui ne m'appartient pas", (done) => {
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
                    .get('/api/category/9/line')
                    .expect(404, done);
                
            });

            test("031012 - Obtenir toutes les lignes d'une catégorie qui n'existe pas", (done) => {
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
                    .get('/api/category/-1/line')
                    .expect(404, done);
                
            });
        });
    });

    describe('3.2 - Créer une catégorie', () => {
        test("032001 - Créer une catégorie de revenu", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateRevenue';
            const type = 'revenue';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            type: type,
                            budgetId: budgetId
                        })
                    );
                    done();
                });
        });

        test("032002 - Créer une catégorie de dépenses", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateExpense';
            const type = 'expense';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            type: type,
                            budgetId: budgetId
                        })
                    );
                    done();
                });
        });

        test("032003 - Créer une catégorie de mauvais type", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong';
            const type = 'test';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(403, done);
        });

        test("032004 - Créer une catégorie sans type", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong2';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    budgetId: budgetId
                })
                .expect(400, done);
        });

        test("032005 - Créer une catégorie avec type vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong3';
            const type = '';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(400, done);
        });

        test("032006 - Créer une catégorie sans nom", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const type = 'revenue';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    type: type,
                    budgetId: budgetId
                })
                .expect(400, done);
        });

        test("032007 - Créer une catégorie avec un nom vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = '';
            const type = 'expense';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(400, done);
        });

        test("032008 - Créer une catégorie sans budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong5';
            const type = 'expense';
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type
                })
                .expect(400, done);
        });

        test("032009 - Créer une catégorie avec budget qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong6';
            const type = 'revenue';
            const budgetId = 9;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(404, done);
        });

        test("032010 - Créer une catégorie avec budget qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'categoryTest_CreateWrong7';
            const type = 'revenue';
            const budgetId = -1;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(404, done);
        });

        test("032011 - Créer une catégorie sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            const name = 'categoryTest_CreateNoAuth';
            const type = 'revenue';
            const budgetId = 5;
            
            request(app)
                .post('/api/category')
                .send({
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(401, done);
        });
    });

    describe('3.3 - Créer une ligne', () => {
        test("033001 - Créer une ligne positive", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create1';
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            description: description,
                            estimate: estimate,
                            categoryId: categoryId
                        })
                    );
                    done();
                });
        });
    
        test("033002 - Créer une ligne négative", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create2';
            const description = 'descTest';
            const estimate = -1000.15;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            description: description,
                            estimate: estimate,
                            categoryId: categoryId
                        })
                    );
                    done();
                });
        });

        test("033003 - Créer une ligne sans nom", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(400, done);
        });

        test("033004 - Créer une ligne avec nom vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = '';
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(400, done);
        });

        test("033005 - Créer une ligne sans description", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create3';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(400, done);
        });

        test("033006 - Créer une ligne avec description vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create4';
            const description = '';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            description: description,
                            estimate: estimate,
                            categoryId: categoryId
                        })
                    );
                    done();
                });
        });

        test("033007 - Créer une ligne sans estimé", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create5';
            const description = 'descTest';
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    categoryId: categoryId
                })
                .expect(400, done);
        });

        test("033008 - Créer une ligne avec estimé nul", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create6';
            const description = 'descTest';
            const estimate = 0;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: name,
                            description: description,
                            estimate: estimate,
                            categoryId: categoryId
                        })
                    );
                    done();
                });
        });

        test("033009 - Créer une ligne sans categorie", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create7';
            const description = 'descTest';
            const estimate = 100.05;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(400, done)
        });

        test("033010 - Créer une ligne avec categorie qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create8';
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = 17;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(404, done);
        });

        test("033011 - Créer une ligne avec categorie qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test002'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });
            
            const name = 'lineTest_Create9';
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = -1;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(404, done);
        });

        test("033012 - Créer une ligne sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);
            
            const name = 'lineTest_Create10';
            const description = 'descTest';
            const estimate = 100.05;
            const categoryId = 9;
            
            request(app)
                .post('/api/line')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate,
                    categoryId: categoryId
                })
                .expect(401, done);
        });
    });

    describe('3.4 - Modifier une catégorie', () => {
        test("034001 - Mettre à jour une catégorie", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const id = 999;
            const name = 'categoryTest_Update1';
            const type = 'revenue';
            const budgetId = 10;
            
            request(app)
                .put('/api/category/17')
                .send({
                    id: id.toString(),
                    name: name,
                    type: type,
                    budgetId: budgetId
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '17', // Should remain unchanged
                            name: name,
                            type: 'expense', // Should remain unchanged
                            budgetId: '9' // Should remain unchanged
                        })
                    );
                    done();
                });
        });

        test("034002 - Mettre à jour une catégorie sans nom", (done) => {
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
                .put('/api/category/18')
                .expect(400, done);
        });

        test("034003 - Mettre à jour une catégorie avec nom vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = '';
            
            request(app)
                .put('/api/category/19')
                .send({
                    name: name
                })
                .expect(400, done);
        });

        test("034004 - Mettre à jour une catégorie qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'categoryTest_Update2';
            
            request(app)
                .put('/api/category/9')
                .send({
                    name: name
                })
                .expect(404, done);
        });

        test("034005 - Mettre à jour une catégorie qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'categoryTest_Update3';
            
            request(app)
                .put('/api/category/-1')
                .send({
                    name: name
                })
                .expect(404, done);
        });

        test("034006 - Mettre à jour une catégorie sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            const name = 'categoryTest_Update4';
            
            request(app)
                .put('/api/category/20')
                .send({
                    name: name
                })
                .expect(401, done);
        });
    });

    describe('3.5 - Modifier une ligne', () => {
        test("035001 - Mettre à jour une ligne", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const id = 1000;
            const name = 'lineTest_Update1';
            const description = 'descTest_updated';
            const categoryId = 10;
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/33')
                .send({
                    id: id,
                    name: name,
                    description: description,
                    categoryId: categoryId,
                    estimate: estimate
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '33', // Should remain unchanged
                            name: name,
                            description: description,
                            categoryId: '17', // Should remain unchanged
                            estimate: estimate
                        })
                    );
                    done();
                });
        });

        test("035002 - Mettre à jour une ligne sans nom", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const description = 'descTest_updated';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/34')
                .send({
                    description: description,
                    estimate: estimate
                })
                .expect(400, done);
        });

        test("035003 - Mettre à jour une ligne avec nom vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = '';
            const description = 'descTest_updated';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/35')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(400, done);
        });

        test("035004 - Mettre à jour une ligne sans description", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update2';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/36')
                .send({
                    name: name,
                    estimate: estimate
                })
                .expect(400, done);
        });

        test("035005 - Mettre à jour une ligne avec description vide", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update3';
            const description = '';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/37')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '37', // Should remain unchanged
                            name: name,
                            description: description,
                            categoryId: '18', // Should remain unchanged
                            estimate: estimate
                        })
                    );
                    done();
                });
        });

        test("035006 - Mettre à jour une ligne sans estimé", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update4';
            const description = 'descTest_updated';
            
            request(app)
                .put('/api/line/38')
                .send({
                    name: name,
                    description: description
                })
                .expect(400, done);
        });

        test("035007 - Mettre à jour une ligne avec estimé nul", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update5';
            const description = 'descTest_updated';
            const estimate = 0;
            
            request(app)
                .put('/api/line/39')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '39', // Should remain unchanged
                            name: name,
                            description: description,
                            categoryId: '18', // Should remain unchanged
                            estimate: estimate
                        })
                    );
                    done();
                });
        });

        test("035008 - Mettre à jour une ligne qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update6';
            const description = 'descTest_updated';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/17')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(404, done);
        });

        test("035009 - Mettre à jour une ligne qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test003'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const name = 'lineTest_Update7';
            const description = 'descTest_updated';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/-1')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(404, done);
        });

        test("035010 - Mettre à jour une ligne sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            const name = 'lineTest_Update8';
            const description = 'descTest_updated';
            const estimate = 100.06;
            
            request(app)
                .put('/api/line/40')
                .send({
                    name: name,
                    description: description,
                    estimate: estimate
                })
                .expect(401, done);
        });

    });

    describe('3.6 - Supprimer une catégorie', () => {
        test("036001 - Supprimer une catégorie sans enfant", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/category/32')
                .expect(204, done);
        });

        test("036002 - Supprimer une catégorie avec enfants", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/category/25')
                .expect(403, done);
        });

        test("036003 - Supprimer une catégorie sans enfant qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/category/40')
                .expect(404, done);
        });

        test("036004 - Supprimer une catégorie sans enfant qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/category/-1')
                .expect(404, done);
        });

        test("036005 - Supprimer une catégorie sans enfant sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            request(app)
                .delete('/api/category/31')
                .expect(401, done);
        });
    });

    describe('3.7 - Supprimer une ligne', () => {
        test("037001 - Supprimer une ligne sans enfant", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/line/64')
                .expect(204, done);
        });

        test("037002 - Supprimer une ligne avec enfants", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/line/49')
                .expect(403, done);
        });

        test("037003 - Supprimer une ligne sans enfant qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/line/80')
                .expect(404, done);
        });

        test("037004 - Supprimer une ligne sans enfant qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    username: 'budgets_test004'
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .delete('/api/line/-1')
                .expect(404, done);
        });

        test("037005 - Supprimer une ligne sans enfant sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            request(app)
                .delete('/api/line/63')
                .expect(401, done);
        });
    });
});