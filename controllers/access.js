const { accessDTO } = require('../dto');
const accessService = require('../services/access');

function getAllByBudget(req, res) {
    accessService.getAccesses({
        budgetId: req.params.budgetId
    }).then(accesses => {
        sendAccess(accesses, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAllByUser(req, res) {
    accessService.getAccesses({
        userId: req.user.id
    }).then(accesses => {
        sendAccess(accesses, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    if (req.body.budgetId && req.body.userId) {
        accessService.addAccess({
            budgetId: req.body.budgetId,
            userId: req.body.userId,
        }).then(a => {
            res.status(201);
            sendAccess(a, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.budgetId && req.params.userId) {
        accessService.deleteAccess({
            budgetId: req.params.budgetId,
            userId: req.params.userId,
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Access Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendAccess(access, res) {
    if (access) {
        let accessRes;
        if (Array.isArray(access)) {
            access.forEach((a, i, arr) => {
                arr[i] = accessDTO(a);
            });
            accessRes = access;
        } else {
            accessRes = accessDTO(access);
        }
        res.send(accessRes);
    } else {
        res.status(404).send({ message: "Access Not Found" });
    }
}

module.exports = {
    getAllByBudget,
    getAllByUser,
    create,
    deleteOne
};