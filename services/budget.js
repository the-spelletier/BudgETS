const { Op } = require('sequelize');
const Budget = require('../models').Budget;

// Retourne un budget (tous les paramètres) selon l'identificateur envoyé en paramètre
const getBudget = budget => {
    return Budget.findOne({
        where: budget
    });
}

// Retourne tous les budgets
const getBudgets = () => {
    return Budget.findAll();
};

// Ajout d'un budget
const addBudget = budget => {
    budget = Budget.build(budget, {raw: true});
    budget.isActive = false;
    return budget.save();
}

// Mise à jour d'un budget selon l'identificateur envoyé en paramètre
const updateBudget = budget => {
    return Budget.update(budget, { 
        where: { 
            id: budget.id 
        } 
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

// Retourne le budget selon son id et set isActive à true
const resetGetActiveBudget = budget => {
    return getBudget(budget).then(b => {
        if (b) {
            return Budget.update({ 
                isActive: false 
            }, { 
                where: {
                    id : { 
                        [Op.notIn]: [b.id] 
                    } 
                }
            }).then(() => {
                b.isActive = true;
                return b.save();
            });
        }
    })
}

module.exports = {
    getBudget,
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    resetGetActiveBudget
};
