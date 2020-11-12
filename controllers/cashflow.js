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
    // Validate year and month between start and end dates of budget
    if (req.body.categoryId && req.body.year && req.body.month && typeof req.body.estimate != 'undefined') { 
        let cDate = new Date(req.body.year, parseInt(req.body.month) - 1);
        if (cDate >= new Date(req.budget.startDate) && cDate <= new Date(req.budget.endDate)) {
            cashflowService.addCashflow({
                categoryId: req.body.categoryId,
                year: req.body.year,
                month: req.body.month,
                estimate: req.body.estimate,
            }).then(c => {
                res.status(201);
                sendCashflow(c, res);
            }).catch(err => {
                res.status(403).send({ message: 'Validation error' });
            });
        } else {
            res.status(403).send({ message: 'Validation error' });
        }
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