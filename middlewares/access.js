const accessService = require('../services/access');
const budgetService = require('../services/budget');
const categoryService = require('../services/category');
const lineService = require('../services/line');
const entryService = require('../services/entry');
const memberService = require('../services/member');

const validateBudget = (budgetId, req, res, next, checkOwner) => {
    // Obtenir le budgetId à partir de la catégorie
    return budgetService.getBudget({
        id: budgetId
    }).then(budget => {
        if (budget) {
            req.budget = budget;
            if (budget.userId === req.user.id) {
                return next();
            }
            if (checkOwner) {
                return res.status(404).send({
                    message: 'Invalid access'
                });
            }
            // Valider l'accès au budget
            return accessService.getAccesses({
                budgetId: budgetId
            }).then(accesses => {
                if (accesses && accesses.find(({ userId }) => userId === req.user.id)) {
                    return next();
                } else {
                    return res.status(404).send({
                        message: 'Invalid access'
                    });
                }
            });
        } else {
            return res.status(404).send({
                message: 'Invalid budget'
            });
        }
    }).catch(err => {
        return res.status(404).send({
            message: 'An unexpected error occurred'
        });
    });
}

const validateCategory = (categoryId, req, res, next, checkOwner) => {
    // Obtenir le budgetId à partir de la catégorie
    return categoryService.getCategory({
        id: categoryId
    }).then(category => {
        if (category) {
            req.category = category;
            return validateBudget(category.budgetId, req, res, next, checkOwner);
        } else {
            return res.status(404).send({
                message: 'Invalid category'
            });
        }
    }).catch(err => {
        return res.status(404).send({
            message: 'An unexpected error occurred'
        });
    });
}

const validateLine = (lineId, req, res, next, checkOwner) => {
    // Obtenir le categoryId à partir de la ligne
    return lineService.getLine({
        id: lineId
    }).then(line => {
        if (line) {
            req.line = line;
            return validateCategory(line.categoryId, req, res, next, checkOwner);
        } else {
            return res.status(404).send({
                message: 'Invalid line'
            });
        }
    }).catch(err => {
        return res.status(404).send({
            message: 'An unexpected error occurred'
        });
    });
}

const validateEntry = (entryId, req, res, next, checkOwner) => {
    // Obtenir le lineId à partir de l'entrée
    return entryService.getEntry({
        id: entryId
    }).then(entry => {
        if (entry) {
            req.entry = entry;
            return validateLine(entry.lineId, req, res, next, checkOwner);
        } else {
            return res.status(404).send({
                message: 'Invalid entry'
            });
        }
    }).catch(err => {
        return res.status(404).send({
            message: 'An unexpected error occurred'
        });
    });
}

const validateMember = (memberId, req, res, next) => {
    // Obtenir le lineId à partir du membre
    return memberService.getMember(memberId).then(member => {
        if (member) {
            if (member.userId === req.user.id) {
                req.member = member;
                return next();
            } else {
                return res.status(403).send({
                    message: 'Invalid access'
                });
            }
        } else {
            return res.status(404).send({
                message: 'Invalid member'
            });
        }
    }).catch(err => {
        return res.status(404).send({
            message: 'An unexpected error occurred'
        });
    });
}

const hasBudgetAccess = (req, res, next, checkOwner = false) => {
    // Vérifier la présence de l'identifiant de budget
    const budgetId = req.params.budgetId || req.body.budgetId;
    if (!req.user.id) {
        return res.sendStatus(400);
    } else if (typeof budgetId === 'undefined') {
        return next();
    }

    return validateBudget(budgetId, req, res, next, checkOwner);
};

const isBudgetOwner = (req, res, next) => {
    return hasBudgetAccess(req, res, next, true);
};

const hasCategoryAccess = (req, res, next, checkOwner = false) => {
    // Vérifier la présence de l'identifiant de catégorie
    const categoryId = req.params.categoryId || req.body.categoryId;
    if (!req.user.id) {
        return res.sendStatus(400);
    } else if (typeof categoryId === 'undefined') {
        return next();
    }

    return validateCategory(categoryId, req, res, next, checkOwner);
};

const isCategoryOwner = (req, res, next) => {
    return hasCategoryAccess(req, res, next, true);
};

const hasLineAccess = (req, res, next, checkOwner = false) => {
    // Vérifier la présence de l'identifiant de ligne
    const lineId = req.params.lineId || req.body.lineId;
    if (!req.user.id) {
        return res.sendStatus(400);
    } else if (typeof lineId === 'undefined') {
        return next();
    }

    return validateLine(lineId, req, res, next, checkOwner);
};

const isLineOwner = (req, res, next) => {
    return hasLineAccess(req, res, next, true);
};

const hasEntryAccess = (req, res, next, checkOwner = false) => {
    // Vérifier la présence de l'identifiant d'entrée
    const entryId = req.params.entryId || req.body.entryId;
    if (!req.user.id) {
        return res.sendStatus(400);
    } else if (typeof entryId === 'undefined') {
        return next();
    }

    return validateEntry(entryId, req, res, next, checkOwner);
};

const isEntryOwner = (req, res, next) => {
    return hasEntryAccess(req, res, next, true);
};

const isMemberOwner = (req, res, next) => {
    // Vérifier la présence de l'identifiant du membre
    const memberId = req.params.memberId || req.body.memberId;
    if (!req.user.id) {
        return res.sendStatus(400);
    } else if (typeof memberId === 'undefined') {
        return next();
    }

    return validateMember(memberId, req, res, next);
};

module.exports = {
    hasBudgetAccess,
    isBudgetOwner,
    hasCategoryAccess,
    isCategoryOwner,
    hasLineAccess,
    isLineOwner,
    hasEntryAccess,
    isEntryOwner,
    isMemberOwner
};