const { entryStatusDTO } = require('../dto');
const entryStatusService = require('../services/entryStatus');

function getAll(req, res) {
    entryStatusService.getStatuses().then(status => {
        sendStatus(status, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
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
    getAll
};