const { Op } = require('sequelize');
const { Budget, Category, Line } = require('../models');

// Retourne un budget selon l'identificateur envoyé en paramètre
const getBudget = budget => {
    return Budget.findOne({
        where: budget
    });
}

// Retourne un budget selon l'ID
const getBudgetByID = id => {
    return Budget.findOne({
        where: {
            id : id
        },
        include: [{
            model: Category,
            include: [{
                model: Line,
            }]
        }]
    });
}

// Retourne tous les budgets
const getBudgets = (budget, budgetIds) => {
    return Budget.findAll({ 
        where: {
            [Op.or]: [
                budget,
                {
                    id: {
                        [Op.in]: [...budgetIds]
                    }
                }
            ]
        }
    });
};

const getBudgetSummary = (budget, categories) => {
    ['revenue', 'expense'].forEach(t => {
        budget[t] = {};
        budget[t].real = 0;
        budget[t].estimate = 0;
    })
    categories.forEach(c => {
        c.Lines.forEach(l => {
            budget[c.type].real += Number(l.get('real'));
            budget[c.type].estimate += Number(l.get('estimate'));
        });
    });
    budget.revenue.real = budget.revenue.real.toFixed(2);
    budget.revenue.estimate = budget.revenue.estimate.toFixed(2);
    budget.expense.real = budget.expense.real.toFixed(2);
    budget.expense.estimate = budget.expense.estimate.toFixed(2);
}

const getLastBudgetsFromDate = (id, count) => {
    return getBudget({id: id}).then(b => {
        let res = null;
        if (b) {
            res = {
                currentBudget: b,
                previousBudgets: []
            }
            if (count > 0) {
                return Budget.findAll({ 
                    where: {
                        userId: b.userId,
                        startDate: { 
                            [Op.lt]: b.startDate 
                        }
                    },
                    limit: Number(count)
                }).then(budgets => {
                    if (budgets) {
                        res.previousBudgets = budgets;
                        return res;
                    }
                });
            }
        }
        return res;
    });
};

// Ajout d'un budget
const addBudget = budget => {
    budget = Budget.build(budget, {raw: true});
    budget.isActive = false;
    return budget.save();
}

// Mise à jour d'un budget selon l'identificateur envoyé en paramètre
const updateBudget = budget => {
    return Budget.findOne({
        where: {
            id: budget.id
        }
    }).then(b => {
        let startDate = new Date(budget.startDate || b.startDate);
        let endDate = new Date(budget.endDate || b.endDate);
        if (b) {
            if (startDate.getTime() > endDate.getTime()) {
                throw new Error('Invalid date');
            }
            return b.update(budget);
        }
        return b;
    });
}

// Suppression d'un budget selon l'identificateur envoyé en paramètre
const deleteBudget = budget => {
    return Budget.destroy({ 
        where: { 
            id: budget.id 
        } 
    });
}

module.exports = {
    getBudget,
    getBudgetByID,
    getBudgets,
    getBudgetSummary,
    getLastBudgetsFromDate,
    addBudget,
    updateBudget,
    deleteBudget
};
