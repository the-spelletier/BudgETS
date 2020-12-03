const nodemailer = require("nodemailer");

const settings = require('../config/emailConfig');
const { entryDTO } = require('../dto');
const entryService = require('../services/entry');
const entryStatusService = require('../services/entryStatus');
const memberService = require('../services/member');

function get(req, res) {
    entryService.getEntry({ id: req.params.entryId }).then(entry => {
        sendEntry(entry, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    entryService.getEntries(req.params.budgetId).then(entries => {
        sendEntry(entries, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let entry = entryDTO(req.body);
    if (entry.lineId && entry.date && entry.description && entry.entryStatusId && typeof entry.amount !== 'undefined') { 
        entryService.addEntry(entry).then(e => {
            res.status(201);
            sendEntry(e, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let newEntry = entryDTO(req.body);
    let notify = req.body.notify;
    delete req.body.notify;

    if (req.params.entryId && req.body.lineId && typeof req.body.amount !== 'undefined' && req.body.date && typeof newEntry.description !== 'undefined' && newEntry.entryStatusId) {
        newEntry.id = req.params.entryId;
        newEntry.memberId = req.body.memberId || null;
        entryService.updateEntry(newEntry).then(e => {

            if (notify){
                entryStatusService
                .getStatus(newEntry.entryStatusId)
                .then(s => {
                    memberService
                    .getMember(newEntry.memberId)
                    .then(m => {
                        sendEmail(newEntry, s.name, m);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            }

            sendEntry(e, res);
            
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.entryId) {
        entryService.deleteEntry({
            id: req.params.entryId
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Entry Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendEntry(entry, res) {
    if (entry) {
        let entryRes;
        if (Array.isArray(entry)) {
            entry.forEach((e, i, arr) => {
                arr[i] = entryDTO(e);
            });
            entryRes = entry;
        } else {
            entryRes = entryDTO(entry);
        }
        res.send(entryRes);
    } else {
        res.status(404).send({ message: "Entry Not Found" });
    }
}

const sendEmail = async (entry, statusName, member) => {
    let htmlMessage = "<h1>Bonjour</h1><p>Ceci est un message automatisé de BudgETS pour vous informer que votre demande à changé de status!</p>"
        + "<p>Nom de la facture : " + entry.description + "</p><ol>"
        + "<li>Montant : " + entry.amount + "</li>"
        + "<li>État : " + statusName + "</li>"
        + "<li>Pour le membre : " + member.name + "</li></ol>"
        + "<p>Communiquez avec votre trésorier pour plus d'informationssur l'état de votre demande.</p>";

    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: settings.host,
        port: 465,
        secure: true, // use SSL
        auth: {
            user: settings.address, // generated ethereal user
            pass: settings.pass, // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: settings.address, // sender address
        to: member.email, // list of receivers
        subject: "Changement du statut de votre demande [" + entry.description + "]", 
        html: htmlMessage
    });
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};