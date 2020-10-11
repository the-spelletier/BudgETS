const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

describe('2.0 - Budget', () => {
    describe('2.0 - Autres', () => {
        test("020001 - Supprimer un budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 4
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .post('/api/budget/7')
                .expect(404, done);
            
        });
        
    });

    describe('2.1 - Créer un nouveau budget', () => {
        test("021001 - Création d'un nouveau budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 1
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
                            isActive: false,
                            userId: '1'
                        })
                    );
                    done();
                });
            
        });
        test("021002 - Création sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

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
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 1
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
                    id: 1
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
                    id: 1
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
        test("021006 - Présence d'un statut actif", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 1
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
                    name: 'budgetTest_create6',
                    startDate: start,
                    endDate: end,
                    isActive: true
                })
                .expect(400, done);
        });
        test("021007 - Date début plus grand que fin", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 1
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
    });

    describe('2.2 - Consulter le dernier budget', () => {
        test("022001 - Consultation du dernier budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 2
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
                            id: '3',
                            name: 'budgetTest0201',
                            startDate: new Date(2020, 0, 1).toJSON(),
                            endDate: new Date(2020, 11, 31).toJSON(),
                            isActive: true,
                            userId: '2'
                        })
                    );
                    done();
                });
            
        });
        test("022002 - Dernier budget sans authentification", (done) => {
            // Original authentification service
            auth.verifyAuth.callsFake(originalAuth);

            request(app)
                .get('/api/budget/current')
                .expect(401, done);
            
        });
    });

    describe('2.3 - Consulter un budget', () => {
        test("023001 - Obtenir la liste de tous les budgets", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 2
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get('/api/budget/')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining([{
                            id: '3',
                            name: 'budgetTest0201',
                            startDate: new Date(2020, 0, 1).toJSON(),
                            endDate: new Date(2020, 11, 31).toJSON(),
                            isActive: true,
                            userId: '2'
                        },{
                            id: '4',
                            name: 'budgetTest0202',
                            startDate: new Date(2019, 0, 1).toJSON(),
                            endDate: new Date(2019, 11, 31).toJSON(),
                            isActive: false,
                            userId: '2'
                        }])
                    );
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
                    id: 1
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
                            name: 'budgetTest0102',
                            startDate: new Date(2020, 0, 1).toJSON(),
                            endDate: new Date(2020, 11, 31).toJSON(),
                            isActive: true,
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
                    id: 1
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get('/api/budget/3')
                .expect(401, done);
            
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
                    id: 1
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            request(app)
                .get('/api/budget/-1')
                .expect(404, done);
            
        });
    });

    describe('2.4 - Modifier un budget', () => {
        test("024001 - Mets à jour les champs d'un budget", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 3
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/6')
                .send({
                    name: 'budgetTest_updated1',
                    startDate: start,
                    endDate: end,
                    isActive: true
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: '6',
                            name: 'budgetTest_updated1',
                            startDate: start,
                            endDate: end,
                            isActive: true,
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
                    id: 3
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/5')
                .send({
                    name: 'budgetTest_updated2',
                    startDate: end,
                    endDate: start,
                    isActive: false
                })
                .expect(400, done);
            
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
                    endDate: end,
                    isActive: false
                })
                .expect(401, done);
            
        });
        test("023004 - Mets à jour budget qui ne m'appartient pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 1
                }).then(user => {
                    req.user = User.build(user, {raw: true});
                    next();
                })
            });

            const start = new Date(2020, 0, 2).toJSON();
            const end = new Date(2020, 11, 30).toJSON();

            request(app)
                .put('/api/budget/5')
                .send({
                    name: 'budgetTest_updated4',
                    startDate: start,
                    endDate: end,
                    isActive: false
                })
                .expect(401, done);
            
        });
        test("023005 - Mets à jour budget qui n'existe pas", (done) => {
            // Stub the verifyAuth
            auth.verifyAuth.callsFake((req, res, next) => {
                userService.getUser({
                    id: 2
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
                    endDate: end,
                    isActive: false
                })
                .expect(404, done);
            
        });
    });
});
