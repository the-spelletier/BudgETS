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
    return Budget.create(budget);
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

module.exports = {
    getBudget,
    addBudget,
    updateBudget,
    deleteBudget
};
