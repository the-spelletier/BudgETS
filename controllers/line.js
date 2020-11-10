const { lineDTO } = require('../dto');
const lineService = require('../services/line');

function get(req, res) {
    return res.sendStatus(404);
    lineService.getLine({ id: req.params.lineId }).then(line => {
        sendLine(line, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    lineService.getLines(req.params.categoryId).then(lines => {
        sendLine(lines, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let line = lineDTO(req.body);
    if (line.name && line.categoryId && typeof line.description != 'undefined' && typeof line.estimate != 'undefined') { 
        lineService.addLine(line).then(l => {
            res.status(201);
            sendLine(l, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    if (req.params.lineId && req.body.name && typeof req.body.description != 'undefined' && typeof req.body.estimate != 'undefined') { 
        lineService.updateLine({
            id: req.params.lineId, 
            name: req.body.name, 
            description: req.body.description, 
            estimate: req.body.estimate, 
            orderNumber: req.body.orderNumber
        }).then(l => {
            sendLine(l, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.lineId) {
        lineService.deleteLine({
            id: req.params.lineId
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Line Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendLine(line, res) {
    if (line) {
        let lineRes;
        if (Array.isArray(line)) {
            line.forEach((b, i, arr) => {
                arr[i] = lineDTO(b);
                delete arr[i].description;
                delete arr[i].estimate;
                delete arr[i].categoryId;
            });
            lineRes = line;
        } else {
            lineRes = lineDTO(line);
        }
        res.send(lineRes);
    } else {
        res.status(404).send({ message: "Line Not Found" });
    }
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};