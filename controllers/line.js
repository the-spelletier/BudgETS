const { lineDTO } = require('../dto');
const lineService = require('../services/line');

function get(req, res) {
    return res.sendStatus(404);
    lineService.getLine({ id: req.params.id }).then(line => {
        sendLine(line, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    lineService.getLines(req.params.categoryId).then(lines => {
        sendLine(lines, res);
    }).catch(err => {
        console.log(err);
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
    let line = lineDTO(req.body);
    if (req.params.id && line.name && typeof line.description != 'undefined' && typeof line.estimate != 'undefined') { 
        line.id = req.params.id;
        lineService.updateLine(line).then(l => {
            sendLine(l, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    let line = lineDTO(req.params);
    if (line.id) {
        lineService.deleteLine(line).then(result => {
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