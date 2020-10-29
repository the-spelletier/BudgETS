const { entryDTO } = require('../dto');
const entryService = require('../services/entry');

function get(req, res) {
    entryService.getEntry({ id: req.params.id }).then(entry => {
        sendEntry(entry, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    entryService.getEntries(req.params.budgetId).then(entries => {
        sendEntry(entries, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let entry = entryDTO(req.body);
    // TODO add validation for member
    if (entry.lineId && entry.amount && entry.date && entry.description) { 
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
    let entry = entryDTO(req.body);
    if (req.params.id) {
        entry.id = req.params.id;
        entryService.updateEntry(entry).then(e => {
            sendEntry(e, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    let entry = entryDTO(req.params);
    if (entry.id) {
        entryService.deleteEntry(entry).then(result => {
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

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};