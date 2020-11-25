const { entryStatusDTO } = require('../dto');
const entryStatusService = require('../services/entryStatus');

function get(req, res) {
    entryStatusService.getStatus(req.params.statusId).then(status => {
        sendStatus(status, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    entryStatusService.getStatuses().then(status => {
        sendStatus(status, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let status = entryStatusDTO(req.body);
    if (status.name && status.position) { 
        entryStatusService.addStatus(status).then(s => {
            res.status(201);
            sendStatus(s, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let status = entryStatusDTO(req.body);
    if (req.params.statusId && req.body.name && req.body.position) {
        status.id = req.params.statusId;
        entryStatusService.updateStatus(status).then(s => {
            sendStatus(s, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.statusId) {
        entryStatusService.deleteStatus({
            id: req.params.statusId
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Status Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendStatus(status, res) {
    if (status) {
        let statusRes;
        if (Array.isArray(status)) {
            status.forEach((e, i, arr) => {
                arr[i] = entryStatusDTO(e);
            });
            statusRes = status;
        } else {
            statusRes = entryStatusDTO(status);
        }
        res.send(statusRes);
    } else {
        res.status(404).send({ message: "Status Not Found" });
    }
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};