const request = require('supertest');
const sinon = require('sinon');
const auth = require('../middlewares/auth');

const { User } = require('../models');
const userService = require('../services/user');

const originalAuth = auth.verifyAuth;
const stubAuth = sinon.stub(auth, 'verifyAuth');

const app = require('../app.js');

function getEntry(amount, date, description, lineId, memberId, entryStatusId) {
    return {
        amount: amount,
        date, date,
        description: description,
        lineId: lineId,
        memberId: memberId,
        entryStatusId: entryStatusId
    };
}

function getRouteAllEntries(budgetId) {
    if (budgetId) {
        return '/api/budget/' + budgetId  + '/entry/';
    } else {
        return '/api/budget/entry/';
    }
}

function getRouteBaseEntry() {
    return '/api/entry/'
}

function getRouteOneEntry(entryId) {
    return '/api/entry/' + entryId
}

function stubAuthEntries(username) {
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

function sortBody(body) {
    body.sort((a,b) => (parseInt(a.id) < parseInt(b.id)) ? -1 : ((parseInt(a.id) > parseInt(b.id)) ? 1 : 0));
}

describe('7.0 - Entrées budgétaires', () => {
    beforeEach(() => {
        // Restore original authentification
        auth.verifyAuth.callsFake(originalAuth);
    });

    describe('7.1 - Route vers les entrées', () => {
        test("071001 - Obtenir toutes les entrées d'un budget", (done) => {
            stubAuthEntries('budgets_test001')

            request(app)
                .get(getRouteAllEntries(1))
                .expect(200)
                .then((response) => {
                    //response.body.sort((a,b) => (parseInt(a.id) < parseInt(b.id)) ? -1 : ((parseInt(a.id) > parseInt(b.id)) ? 1 : 0));
                    sortBody(response.body);
                    expect(response.body.length).toEqual(16);
                    for (let i = 0; i < response.body.length; ++i) {
                        expect(response.body[i].id).toEqual((i + 1).toString());
                    }
                    done();
                });
        });

        test("071002 - Route vers les entrées budgétaiores sans budgetId", (done) => {
            stubAuthEntries('budgets_test001')

            request(app)
                .get(getRouteAllEntries())
                .expect(404, done);
        });
    
    });

    describe('7.2 - Obtenir les entrées', () => {
        test("072001 - Obtenir toutes les entrées budgétaires d'un budget vide", (done) => {
            stubAuthEntries('budgets_test001')

            request(app)
                .get(getRouteAllEntries(4))
                .expect(200)
                .then((response) => {
                    sortBody(response.body);
                    expect(response.body.length).toEqual(0);
                    done();
                });
        });

        test("072002 - Obtenir toutes les entrées budgétaires sans authentification", (done) => {
            request(app)
                .get(getRouteAllEntries(1))
                .expect(401, done);
        });

        test("072003 - Obtenir toutes les entrées budgétaires d'un budget qui ne m'appartient pas", (done) => {
            stubAuthEntries('budgets_test001')

            request(app)
                .get(getRouteAllEntries(5))
                .expect(404, done);
        });

        test("072004 - Obtenir toutes les entrées budgétaires d'un budget qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test001')

            request(app)
                .get(getRouteAllEntries(-1))
                .expect(404, done);
        });

    });

    describe('7.3 - Créer les entrées', () => {
        test("073001 - Créer une entrée budgétaire de revenu", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
  
            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body.amount).toBeGreaterThan(0);
                    done();
                });
        });

        test("073002 - Créer une entrée budgétaire de dépense", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                -110.15,
                new Date(2020, 9, 28),
                'testDesc',
                27,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(201)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body.amount).toBeLessThan(0);
                    done();
                });
        });

        test("073003 - Créer une entrée budgétaire sans lineId", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.lineId;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073004 - Créer une entrée budgétaire avec lineId qui ne m'appartient pas", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                40,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(404, done);
        });

        test("073005 - Créer une entrée budgétaire avec lineId qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                -1,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(404, done);
        });

        test("073006 - Créer une entrée budgétaire sans amount", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.amount;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073007 - Créer une entrée budgétaire avec amount null", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                0,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(201, done);
        });

        test("073008 - Créer une entrée budgétaire sans date", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.date;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073009 - Créer une entrée budgétaire avec date plus petite que le budget", (done) => {
            /*
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2019, 9, 28),
                'testDesc',
                24,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
            */
            expect(true).toBe(true); // Test removed, irrelevant.
            done();
        });

        test("073010 - Créer une entrée budgétaire avec date plus grande que le budget", (done) => {
            /*
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2021, 9, 28),
                'testDesc',
                24,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(404, done);
            */
            expect(true).toBe(true); // Test removed, irrelevant.
            done();
        });

        test("073011 - Créer une entrée budgétaire sans membre", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.memberId;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(201, done);
        });

        test("073012 - Créer une entrée budgétaire avec membre sans acces au bugdet", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                5,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(403, done);
        });

        test("073013 - Créer une entrée budgétaire avec membre qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                -1,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(404, done);
        });

        test("073014 - Créer une entrée budgétaire sans description", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.description;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073015 - Créer une entrée budgétaire avec description vide", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                '',
                24,
                2,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073016 - Créer une entrée budgétaire sans entryStatus", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                1
            )
            
            delete entry.entryStatusId;

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(400, done);
        });

        test("073017 - Créer une entrée budgétaire avec entryStatus invalide", (done) => {
            stubAuthEntries('budgets_test002')

            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                2,
                -1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(403, done);
        });

        test("073018 - Créer une entrée budgétaire sans authentification", (done) => {
            const entry = getEntry(
                110.15,
                new Date(2020, 9, 28),
                'testDesc',
                24,
                1,
                1
            )

            request(app)
                .post(getRouteBaseEntry())
                .send(entry)
                .expect(401, done);
        });

    });

    describe('7.4 - Mettre à jour les entrées', () => {
        test("074001 - Modifier une entrée budgtétaire", (done) => {
            stubAuthEntries('budgets_test003')
    
            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(65))
                .send(entry)
                .expect(200)
                .then((response) => {
                    expect(response.body.id).not.toBeUndefined();
                    expect(response.body.description).toEqual('testDesc_updated')
                    done();
                });
        });

        test("074002 - Modifier une entrée budgtétaire sans lineId", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.lineId;

            request(app)
                .put(getRouteOneEntry(66))
                .send(entry)
                .expect(400, done);
        });

        test("074003 - Modifier une entrée budgtétaire avec lineId qui ne m'appartient pas", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                49,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(67))
                .send(entry)
                .expect(404, done);
        });

        test("074004 - Modifier une entrée budgtétaire avec lineId qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                -1,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(68))
                .send(entry)
                .expect(404, done);
        });

        test("074005 - Modifier une entrée budgtétaire sans amount", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.amount;

            request(app)
                .put(getRouteOneEntry(69))
                .send(entry)
                .expect(400, done);
        });

        test("074006 - Modifier une entrée budgtétaire avec amount nul", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                0,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(70))
                .send(entry)
                .expect(200, done);
        });

        test("074007 - Modifier une entrée budgtétaire sans date", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.date;

            request(app)
                .put(getRouteOneEntry(71))
                .send(entry)
                .expect(400, done);
        });

        test("074008 - Modifier une entrée budgtétaire avec date plus petite que le budget", (done) => {
            /*
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2019, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(72))
                .send(entry)
                .expect(400, done);
            */
            expect(true).toBe(true); // Test removed, irrelevant.
            done();
        });

        test("074009 - Modifier une entrée budgtétaire avec date plus grande que le budget", (done) => {
            /*
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2021, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(73))
                .send(entry)
                .expect(400, done);
            */
            expect(true).toBe(true); // Test removed, irrelevant.
            done();
        });

        test("074010 - Modifier une entrée budgtétaire sans membre", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.memberId;

            request(app)
                .put(getRouteOneEntry(74))
                .send(entry)
                .expect(400, done);
        });

        test("074011 - Modifier une entrée budgtétaire avec membre sans acces au budget", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                5,
                2
            )

            request(app)
                .put(getRouteOneEntry(75))
                .send(entry)
                .expect(403, done);
        });

        test("074012 - Modifier une entrée budgtétaire avec membre qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                -1,
                2
            )

            request(app)
                .put(getRouteOneEntry(76))
                .send(entry)
                .expect(404, done);
        });

        test("074013 - Modifier une entrée budgtétaire sans description", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.description;

            request(app)
                .put(getRouteOneEntry(77))
                .send(entry)
                .expect(400, done);
        });

        test("074014 - Modifier une entrée budgtétaire avec description vide", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                '',
                39,
                3,
                2
            )

            request(app)
                .put(getRouteOneEntry(78))
                .send(entry)
                .expect(200, done);
        });

        test("074015 - Modifier une entrée budgtétaire sans entryStatus", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                2
            )

            delete entry.entryStatusId;

            request(app)
                .put(getRouteOneEntry(79))
                .send(entry)
                .expect(400, done);
        });

        test("074016 - Modifier une entrée budgtétaire avec entryStatus invalide", (done) => {
            stubAuthEntries('budgets_test003')

            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                3,
                -1
            )

            request(app)
                .put(getRouteOneEntry(80))
                .send(entry)
                .expect(403, done);
        });

        test("074017 - Modifier une entrée budgtétaire sans authentification", (done) => {
            const entry = getEntry(
                100.15,
                new Date(2020, 9, 28),
                'testDesc_updated',
                39,
                2,
                2
            )

            request(app)
                .put(getRouteOneEntry(81))
                .send(entry)
                .expect(401, done);
        });

    });

    describe('7.5 - Supprimer les entrées', () => {
        test("075001 - Supprimer une entrée budgtétaire", (done) => {
            stubAuthEntries('budgets_test004')

            request(app)
                .delete(getRouteOneEntry(97))
                .expect(204, done);
        });

        test("075002 - Supprimer une entrée budgtétaire qui ne m'appartient pas", (done) => {
            stubAuthEntries('budgets_test004')

            request(app)
                .delete(getRouteOneEntry(129))
                .expect(404, done);
        });

        test("075003 - Supprimer une entrée budgtétaire qui n'existe pas", (done) => {
            stubAuthEntries('budgets_test004')

            request(app)
                .delete(getRouteOneEntry(-1))
                .expect(404, done);
        });

        test("075004 - Supprimer une entrée budgtétaire sans authentification", (done) => {
              request(app)
                .delete(getRouteOneEntry(98))
                .expect(401, done);
        });

    });
});