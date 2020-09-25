const budgetDTO = require('../dto').budgetDTO;
const budgetService = require('../services/budget');

function getCurrent(req, res) {
    budgetService.getBudget({
        isActive: true
    }).then(budget => {
        if (budget) {
            res.send(budgetDTO(budget));
        } else {
            res.status(404).send({ message: "Budget Not Found" });
        }
    });
}

function get(req, res) {
    budgetService.getBudget({
        id: req.params.id
    }).then(budget => {
        res.send(budget);
    });
}

function getAll(req, res) {

}

function create(req, res) {
    if (req.body.name && req.body.startDate && req.body.endDate) {
        req.body.userId = req.user.id;
        req.body.isActive = req.body.isActive === true;
        budgetService.addBudget(req.body).then((result) => {
            res.status(200).send(budgetDTO(result));
        }).catch(err => {
            res.status(401).send({ message: err.message });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function clone(req, res) {

}

function getSummary(req, res) {

}

module.exports = {
    getCurrent,
    get,
    create,
    clone,
    getSummary
};