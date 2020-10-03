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
    budgetService.resetGetActiveBudget(budgetDTO(req.params)).then(budget => {
        sendBudget(budget, res);
    });
}

function getAll(req, res) {
    budgetService.getBudgets().then(budgets => {
        sendBudget(budgets, res);
    })
    .catch(err => {
        console.log(err);
    });;
}

function create(req, res) {
    let budget = budgetDTO(req.body);
    if (budget.name && budget.startDate && budget.endDate && !budget.isActive) {
        budget.userId = req.user.id
        budgetService.addBudget(budget).then(b => {
            sendBudget(b, res);
        }).catch(err => {
            res.status(401).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let budget = budgetDTO(req.body);
    if (budget.id) {
        budgetService.updateBudget(budget).then(b => {
            sendBudget(b, res);
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
        let budgetRes;
        if (Array.isArray(budget)) {
            budget.forEach((b, i, arr) => {
                arr[i] = budgetDTO(b);
                delete arr[i].startDate;
                delete arr[i].endDate;
            });
            budgetRes = budget
        } else {
            budgetRes = budgetDTO(budget)
        }
        res.send(budgetRes);
    } else {
        res.status(404).send({ message: "Budget Not Found" });
    }
}

module.exports = {
    getCurrent,
    get,
    getAll,
    create,
    update,
    clone,
    getSummary
};