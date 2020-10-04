const lineDTO = require('../dto').lineDTO;
const lineService = require('../services/line');

function get(req, res) {
    lineService.getLine({
        id: req.params.id
    }).then(line => {
        sendLine(line, res);
    });
}

function getAll(req, res) {
    lineService.getLines().then(lines => {
        lines.forEach((b, i, arr) => {
            arr[i] = lineDTO(b);
        });
        res.send(lines);
    });
}

function create(req, res) {
    if (req.body.name, req.body.description, req.body.categoryId) { 
        lineService.addLine(req.body).then((result) => {
            console.log(result);
            res.status(200).send(lineDTO(result));
        }).catch(err => {
            res.status(401).send({ message: err.message });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    lineService.updateLine(req.body).then(result => {
        res.status(200).send(lineDTO(result));
    }).catch(err => {
        res.status(401).send({ message: err.message });
    });
}

function deleteOne(req, res) {
    lineService.deleteLine(req.body).then(result => {
        res.status(200).send();
    }).catch(err => {
        res.status(401).send({ message: err.message });
    });
}

function sendLine(line, res) {
    if (line) {
        res.send(lineDTO(line));
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