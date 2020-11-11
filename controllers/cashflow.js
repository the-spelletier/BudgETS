const { cashflowDTO } = require('../dto');
const cashflowService = require('../services/cashflow');

function get(req, res) {
    return res.sendStatus(404);
    cashflowService.getCashflow({ id: req.params.cashflowId }).then(cashflow => {
        sendCashflow(cashflow, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let cashflow = cashflowDTO(req.body);
    // Validate year and month between start and end dates of budget
    if (cashflow.categoryId && cashflow.year && cashflow.month && typeof cashflow.estimate != 'undefined') { 
        cashflowService.addCashflow(cashflow).then(c => {
            res.status(201);
            sendCashflow(c, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    if (req.params.cashflowId && typeof req.body.estimate != 'undefined') { 
        cashflowService.updateCashflow({
            id: req.params.cashflowId, 
            estimate: req.body.estimate
        }).then(c => {
            sendCashflow(c, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.cashflowId) {
        cashflowService.deleteCashflow({
            id: req.params.cashflowId
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Cashflow Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendCashflow(cashflow, res) {
    if (cashflow) {
        let cashflowRes;
        if (Array.isArray(cashflow)) {
            cashflow.forEach((c, i, arr) => {
                arr[i] = cashflowDTO(c);
            });
            cashflowRes = cashflow;
        } else {
            cashflowRes = cashflowDTO(cashflow);
        }
        res.send(cashflowRes);
    } else {
        res.status(404).send({ message: "Cashflow Not Found" });
    }
}

module.exports = {
    get,
    create,
    update,
    deleteOne
};