const budgetDTO = require('../dto').budgetDTO;
const budgetService = require('../services/budget');

function getCurrent(req, res) {
    budgetService.getBudget({
        isActive: true
    }).then(budget => {
        sendBudget(budget, res);
    });
}

function get(req, res) {
    budgetService.resetGetActiveBudget({
        id: req.params.id
    }).then(budget => {
        sendBudget(budget, res);
    });
}

function getAll(req, res) {
    budgetService.getBudgets().then(budgets => {
        budgets.forEach((b, i, arr) => {
            arr[i] = budgetDTO(b);
        });
        res.send(budgets);
    });
}

function create(req, res) {
    if (req.body.name && req.body.startDate && req.body.endDate) {
        req.body.userId = req.user.id;
        budgetService.addBudget(req.body).then(budget => {
            sendBudget(budget, res);
        }).catch(err => {
            res.status(401).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function clone(req, res) {

}

function getSummary(req, res) {

}

function sendBudget(budget, res) {
    if (budget) {
        res.send(budgetDTO(budget));
    } else {
        res.status(404).send({ message: "Budget Not Found" });
    }
}

module.exports = {
    getCurrent,
    get,
    getAll,
    create,
    clone,
    getSummary
};