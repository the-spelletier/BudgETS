const { Op } = require('sequelize');
const { Category, Line, Entry, Cashflow, sequelize } = require('../models');

// Retourne une catégorie selon l'identificateur envoyé en paramètre
const getCategory = category => {
    return Category.findOne({
        where: category
    });
}

// Retourne toutes les catégories
const getCategories = (budgetId, light, type) => {
    let options = { 
        where: {
            budgetId: budgetId
        }
    };
    if (!light) {
        options.include = {
            model: Line,
            attributes: {
                include: [
                  [sequelize.fn('IFNULL', sequelize.fn('SUM', sequelize.col('amount')), 0), 'real']
                ]
            },
            include: {
                model: Entry,
                attributes: []
            },
        };
        options.group = [
            'Lines.id',
            'Category.id'
        ];
    }
    if (type) {
        options.where.type = type;
    }
    return Category.findAll(options);
}

const getCategoriesSummary = (budgetId, light, type) => {
    return getCategories(budgetId, light, type).then(categories => {
        categories.forEach((c, i, arr) => {
            c.real = 0;
            c.estimate = 0;
            c.Lines.forEach(l => {
                c.real += Number(l.get('real'));
                c.estimate += Number(l.get('estimate'));
            })
            c.real = c.real.toFixed(2);
            c.estimate = c.estimate.toFixed(2);
            delete c.Lines;
        });
        return categories;
    });
}

// Retourne tous les cashflows des catégories selon l'identifiant de budget
const getCategoriesEstimateCashflows = budgetId => {
    let options = {
        attributes: ['id', 'name'],
        where: {
            budgetId: budgetId
        },
        include: {
            model: Cashflow
        }
    };
    return Category.findAll(options);
}

// Retourne tous les cashflows des catégories selon l'identifiant de budget
const getCategoriesRealCashflows = budgetId => {
    let options = {
        attributes: [
            'id', 
            'name',
            [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
            [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
            [sequelize.fn('SUM', sequelize.col('amount')), 'real']
        ],
        include: {
            model: Line,
            required: true,
            attributes: [],
            include: {
                model: Entry,
                required: true,
                attributes: []
            },
        },
        where: {
            budgetId: budgetId
        },
        group: [
            'Category.id',
            [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
            [sequelize.fn('MONTH', sequelize.col('date')), 'month']
        ],
        raw: true
    };

    return Category.findAll(options);
}

// Ajout d'une catégorie
const addCategory = category => {
    return Category.create(category);
}

// Mise à jour d'une catégorie selon l'identificateur envoyé en paramètre
const updateCategory = category => {
    return Category.findOne({
        where: {
            id: category.id 
        }
    }).then(c => {
        if (c) {
            return c.update(category);
        }
        return c;
    });
}

// Suppression d'une catégorie selon l'identificateur envoyé en paramètre
const deleteCategory = category => {
  return Category.destroy({ 
    where: { 
        id: category.id 
    } 
  });
}

module.exports = {
    getCategory,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesSummary,
    getCategoriesEstimateCashflows,
    getCategoriesRealCashflows,
};
