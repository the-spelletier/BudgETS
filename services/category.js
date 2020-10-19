const { Op } = require('sequelize');
const { Category, Line, Entry, sequelize } = require('../models');
const { categoryDTO } = require('../dto');

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
};

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
            categoryDTO(category, c);
            return c.save();
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
    deleteCategory
};
