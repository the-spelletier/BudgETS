const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');


const memberController = require('../controllers/member');

const { User } = require('../models');
const userService = require('../services/user');
const memberService = require('../services/member');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const originalGetMembers = memberService.getMembers;
const stubGetMembers = sinon.stub(memberService, 'getMembers');

const originalUpdateMember = memberService.updateMember;
const stubUpdateMember = sinon.stub(memberService, 'updateMember');

const originalDeleteMember = memberService.deleteMember;
const stubDeleteMember = sinon.stub(memberService, 'deleteMember');

const app = require('../app.js');
const member = require('../services/member');

function getRouteMember(memberId) {
    if (memberId) {
        return '/api/member/' + memberId + "/"
    } else {
        return '/api/member/'
    }
}

function getRouteByUser(userId) {
    return '/api/user/' + userId +'/members/';
}

function stubAuthMembers(username) {
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

describe('13.0 - Membres', () => {
    beforeEach(() => {
        // Restore original stubs
        auth.verifyAuth.callsFake(originalAuth);
        memberService.getMembers.callsFake(originalGetMembers);
        memberService.updateMember.callsFake(originalUpdateMember);
        memberService.deleteMember.callsFake(originalDeleteMember);
    });

    describe('13.1 - Obtenir membre', () => {
        test("131001 - Obtenir un membre", (done) => {
            stubAuthMembers('budgets_test001')

            request(app)
                .get(getRouteMember(100))
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual({
                        id: '100',
                        userId: '1',
                        name: 'member_test001',
                        code: '98765432110',
                        email: '1member@test.com',
                        active: true,
                        notify: false,
                        deleted: false
                    });
                    done();
                });
        });

        test("131002 - Obtenir un membre sans authentification", (done) => {
            //stubAuthMembers('budgets_test001')

            request(app)
                .get(getRouteMember(100))
                .expect(401, done);
        });

        test("131003 - Obtenir un membre sans être le user owner", (done) => {
            stubAuthMembers('budgets_test009')

            request(app)
                .get(getRouteMember(100))
                .expect(403, done);
        });

        test("131004 - Obtenir un membre avec memeberId invalide", (done) => {
            stubAuthMembers('budgets_test001')

            app.get(
                '/api/member/test/test',
                auth.verifyAuth,
                memberController.get
            );

            request(app)
                .get('/api/member/test/test')
                .expect(500, done);
        });
    
        test("131005 - Obtenir un membre avec member inexistant", (done) => {
            stubAuthMembers('budgets_test001')

            request(app)
                .get(getRouteMember(-1))
                .expect(404, done);
        });

        test("131006 - Obtenir les membres d'un user", (done) => {
            stubAuthMembers('budgets_test001')

            request(app)
                .get(getRouteByUser(1))
                .expect(200)
                .then((response) => {
                    response.body.sort((a,b) => (parseInt(a.id) < parseInt(b.id)) ? -1 : ((parseInt(a.id) > parseInt(b.id)) ? 1 : 0));
                    expect(response.body.length).toEqual(11);
                    expect(response.body[0].id).toEqual("1");
                    expect(response.body[1].id).toEqual("100");
                    expect(response.body[2].id).toEqual("101");
                    expect(response.body[3].id).toEqual("102");
                    expect(response.body[4].id).toEqual("103");
                    expect(response.body[5].id).toEqual("104");
                    expect(response.body[6].id).toEqual("105");
                    expect(response.body[7].id).toEqual("106");
                    expect(response.body[8].id).toEqual("107");
                    expect(response.body[9].id).toEqual("108");
                    expect(response.body[10].id).toEqual("109");
                    done();
                });
        });

        test("131007 - Obtenir les membres d'un user sans authentification", (done) => {
            //stubAuthMembers('budgets_test001')

            request(app)
                .get(getRouteByUser(1))
                .expect(401, done);
        });

        test("131008 - Obtenir les membres d'un user avec BD down", (done) => {
            stubAuthMembers('budgets_test001')

            // Stub the service
            memberService.getMembers.callsFake(userId => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .get(getRouteByUser(1))
                .expect(500, done);
        });

    });

    describe('13.2 - Ajouter membre', () => {
        test("132001 - Créer un membre", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test1',
                    code: 't1',
                    email: 'test1@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(201)
                .then((response) => {
                    delete response.body.id;
                    expect(response.body).toEqual({
                        userId: '2',
                        name: 'test1',
                        code: 't1',
                        email: 'test1@gmail.com',
                        active: true,
                        notify: true,
                        deleted: false
                    });
                    done();
                });
        });

        test("132002 - Créer un membre sans authentification", (done) => {
            //stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test2',
                    code: 't2',
                    email: 'test2@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(401, done)
        });

        test("132003- Créer un membre sans nom", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    //name: 'test3',
                    code: 't3',
                    email: 'test3@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132004- Créer un membre avec nom vide", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: '',
                    code: 't4',
                    email: 'test4@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132005- Créer un membre sans code", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test5',
                    //code: 't5',
                    email: 'test5@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132006- Créer un membre avec code vide", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test6',
                    code: '',
                    email: 'test6@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132007- Créer un membre sans email", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test7',
                    code: 't7',
                    //email: 'test7@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132008- Créer un membre avec email vide", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test8',
                    code: 't8',
                    email: '',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(400, done)
        });

        test("132009- Créer un membre avec code non unique", (done) => {
            stubAuthMembers('budgets_test002')

            request(app)
                .post(getRouteMember())
                .send({
                    name: 'test9',
                    code: '9876543211',
                    email: 'test9@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: true,
                    deleted: false
                })
                .expect(403, done)
        });
    });

    describe('13.3 - Modifier membre', () => {
        test("133001 - Modifier un membre", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(300))
                .send({
                    userId: 7,
                    name: 'testupdate1',
                    code: 'tu1',
                    email: 'testupdate1@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(200)
                .then((response) => {
                    delete response.body.id;
                    expect(response.body).toEqual({
                        userId: '3',
                        name: 'testupdate1',
                        code: 'tu1',
                        email: 'testupdate1@gmail.com',
                        notify: true,
                        active: false,
                        deleted: true
                    });
                    done();
                });
        });

        test("133002 - Modifier un membre sans authentification", (done) => {
            //stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(301))
                .send({
                    userId: 7,
                    name: 'testupdate2',
                    code: 'tu2',
                    email: 'testupdate2@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(401, done);
        });

        test("133003 - Modifier un membre sans être le user owner", (done) => {
            stubAuthMembers('budgets_test009')

            request(app)
                .put(getRouteMember(302))
                .send({
                    userId: 7,
                    name: 'testupdate3',
                    code: 'tu3',
                    email: 'testupdate3@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(403, done);
        });

        test("133004 - Modifier un membre avec bd down", (done) => {
            stubAuthMembers('budgets_test003')
            
            // Stub the service
            memberService.updateMember.callsFake(userId => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .put(getRouteMember(300))
                .send({
                    userId: 7,
                    name: 'testupdate4',
                    code: 'tu4',
                    email: 'testupdate4@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(403, done);
        });

        test("133005 - Modifier un membre avec member inexistant", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(-1))
                .send({
                    userId: 7,
                    name: 'testupdate5',
                    code: 'tu5',
                    email: 'testupdate5@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(404, done);
        });

        test("133006 - Modifier un membre sans member id", (done) => {
            stubAuthMembers('budgets_test003')
            
            app.put(
                '/api/member/test/test',
                auth.verifyAuth,
                memberController.update
            );

            request(app)
                .put('/api/member/test/test')
                .send({
                    userId: 7,
                    name: 'testupdate6',
                    code: 'tu6',
                    email: 'testupdate6@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133007 - Modifier un membre sans nom", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(303))
                .send({
                    userId: 7,
                    //name: 'testupdate7',
                    code: 'tu7',
                    email: 'testupdate7@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133008 - Modifier un membre avec nom vide", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(304))
                .send({
                    userId: 7,
                    name: '',
                    code: 'tu8',
                    email: 'testupdate8@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133009 - Modifier un membre sans code", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(305))
                .send({
                    userId: 7,
                    name: 'testupdate9',
                    //code: 'tu9',
                    email: 'testupdate9@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133010 - Modifier un membre avec code vide", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(306))
                .send({
                    userId: 7,
                    name: 'testupdate10',
                    code: '',
                    email: 'testupdate10@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133011 - Modifier un membre sans email", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(307))
                .send({
                    userId: 7,
                    name: 'testupdate11',
                    code: 'tu11',
                    //email: 'testupdate11@gmail.com',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });

        test("133012 - Modifier un membre avec email vide", (done) => {
            stubAuthMembers('budgets_test003')

            request(app)
                .put(getRouteMember(308))
                .send({
                    userId: 7,
                    name: 'testupdate12',
                    code: 'tu12',
                    email: '',
                    sms: 'testsms',
                    notify: true,
                    active: false,
                    deleted: true
                })
                .expect(400, done);
        });
    });

    describe('13.4 - Supprimer membre', () => {
        test("134001 - Supprimer un membre", (done) => {
            stubAuthMembers('budgets_test004')

            request(app)
                .delete(getRouteMember(400))
                .expect(204, done);
        });

        test("134002 - Supprimer un membre sans authentification", (done) => {
            //stubAuthMembers('budgets_test004')

            request(app)
                .delete(getRouteMember(401))
                .expect(401, done);
        });

        test("134003 - Supprimer un membre sans être le user owner", (done) => {
            stubAuthMembers('budgets_test009')

            request(app)
                .delete(getRouteMember(402))
                .expect(403, done);
        });


        test("134004 - Supprimer un membre avec memberId invalide", (done) => {
            stubAuthMembers('budgets_test004')

            app.delete(
                '/api/member/test/test/',
                auth.verifyAuth,
                memberController.deleteOne
            );

            request(app)
                .delete('/api/member/test/test/')
                .expect(400, done);
        });

        test("134005 - Supprimer un membre inexistant", (done) => {
            stubAuthMembers('budgets_test004')

            request(app)
                .delete(getRouteMember(-1))
                .expect(404, done);
        });

        test("134006 - Supprimer un membre avec bd down", (done) => {
            stubAuthMembers('budgets_test004')

            // Stub the service
            memberService.deleteMember.callsFake(userId => {
                return new Promise((resolve, reject) => {
                    reject('DB down');
                });
            });

            request(app)
                .delete(getRouteMember(403))
                .expect(403, done);
        });

    });

});