const { budgetDTO, categoryDTO, lineDTO } = require('../dto');
const budgetService = require('../services/budget');
const categoryService = require('../services/category');
const lineService = require('../services/line');
const userService = require('../services/user');
const accessService = require('../services/access');

function getCurrent(req, res) {
    userService.getUserActiveBudget(req.user.id).then(user => {
        if (user.activeBudgetId)
            sendBudget(user.activeBudget, res);
        else {
            budgetService.getBudgets({
                userId: req.user.id
            }).then(budgets => {
                sendBudget(budgets[0], res);
            }).catch(err => {
                res.status(403).send({ message: 'Validation error' });
            });
        }
    }).catch(err => {
        res.status(403).send({ message: 'Validation error' });
    });
}

function get(req, res) {
    budgetService.getBudget({ 
        id: req.params.budgetId
    }).then(b => {
        if (!b) { return budgetNotFoundResponse(res); }
        userService.updateUser({ 
            id: req.user.id,
            activeBudgetId: b.id
        }).then(() => {
            sendBudget(b, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    }).catch(err => {
        res.status(403).send({ message: 'Validation error' });
    });
}

function getAll(req, res) {
    accessService.getAccesses({ userId: req.user.id}).then(accesses => {
        budgetService.getBudgets({ userId: req.user.id }, accesses.map(a => a.budgetId)).then(budgets => {
            sendBudget(budgets, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    }).catch(err => {
        res.status(403).send({ message: 'Validation error' });
    });
}

function getSummary(req, res) {
    let count = typeof req.query.count !== 'undefined' ? req.query.count : 0;
    if (req.params.budgetId) {
        budgetService.getLastBudgetsFromDate(req.params.budgetId, count).then(budgets => {
            if (!budgets) { return budgetNotFoundResponse(res); }
            let counter = 0;
            budgets.previousBudgets.push(budgets.currentBudget);
            budgets.previousBudgets.forEach((b, i, arr) => {
                if (!b) { return budgetNotFoundResponse(res); }
                categoryService.getCategories(b.id).then(categories => {
                    budgetService.getBudgetSummary(b, categories);
                    if (++counter === arr.length) {
                        budgets.previousBudgets.pop();
                        sendBudget(budgets, res);
                    }
                });
            });
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function create(req, res) {
    let budget = budgetDTO(req.body);
    let sDate = new Date(budget.startDate);
    let eDate = new Date(budget.endDate);
    if (budget.name && budget.startDate && budget.endDate && sDate.getTime() < eDate.getTime()) {
        budget.userId = req.user.id;
        budgetService.addBudget(budget).then(b => {
            res.status(201);
            sendBudget(b, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let budget = budgetDTO(req.body);
    if (req.params.budgetId && !req.body.userId) {
        budget.id = req.params.budgetId;
        budgetService.updateBudget(budget).then(b => {
            sendBudget(b, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function clone(req, res) {
    let budget = budgetDTO(req.body);
    if (req.params.budgetId) {

        // Dates for validation
        let sDate = new Date(budget.startDate);
        let eDate = new Date(budget.endDate);
        if (budget.name && budget.startDate && budget.endDate && sDate.getTime() < eDate.getTime()) {

            budget.userId = req.user.id;

            // Get for all categories and lines
            budgetService.getBudgetByID(req.params.budgetId).then(oldB => {

                // Create new budgets
                budgetService.addBudget(budget).then(newB => {

                    // Adding each category
                    let categoryAdd;
                    let message = '';
                    oldB.Categories.forEach(oldC => {
                        categoryAdd = categoryDTO(oldC);
                        delete categoryAdd.id;
                        categoryAdd.budgetId = newB.id; // Assign cat to new budget
                        categoryService.addCategory(categoryAdd).then(newC => {
                            
                            // Adding the lines
                            let lineAdd;
                            oldC.Lines.forEach(oldL => {
                                lineAdd = lineDTO(oldL);

                                delete lineAdd.id;
                                lineAdd.categoryId = newC.id;
                                lineService.addLine(lineAdd).catch(err => {
                                    message = message + 'Impossible d\'ajouter la ligne ' + lineAdd.name + ' ';
                                });
                                
                                return;
                            });

                            return ;
                            
                        }).catch(err => {
                            message = message + 'Impossible d\'ajouter la categorie ' + categoryAdd.name + ' ';
                        });
                    });
                    message = 'Le budget ' + newB.name + ' a ete ajoute! ' + message;
                    res.statusMessage = message;
                    sendBudget(newB, res);

                }).catch(err => {
                    res.status(403).send({ message: 'Impossible d\'ajouter le budget' });
                });
            }).catch(err => {
                res.status(403).send({ message: 'Impossible de trouver le budget de reference' });
            });
        }
        else {
            res.status(400).send({ message: 'Erreur de validation' });
        }
    }
    else {
        res.status(400).send({ message: 'Aucun budget référence indiqué' });
    }
}

function sendBudget(budget, res) {
    if (budget) {
        let budgetRes;
        if (Array.isArray(budget)) {
            budgetRes = formatBudgetArray(budget);
        } else if (budget.hasOwnProperty('currentBudget')) {
            budget.currentBudget = formatBudgetArray([budget.currentBudget])[0];
            formatBudgetArray(budget.previousBudgets);
            budgetRes = budget;
        } else {
            budgetRes = budgetDTO(budget);
        }
        res.send(budgetRes);
    } else {
        budgetNotFoundResponse(res);
    }
}

function budgetNotFoundResponse(res) {
    res.status(404).send({ message: "Budget Not Found" });
}

function formatBudgetArray(budgets) {
    budgets.forEach((b, i, arr) => {
        arr[i] = budgetDTO(b);
        arr[i].shortName = arr[i].name + " (" + arr[i].startDate.toDateString() + " - " + arr[i].endDate.toDateString() + ")";
    });
    return budgets;
}

module.exports = {
    getCurrent,
    get,
    getAll,
    getSummary,
    create,
    update,
    clone
};