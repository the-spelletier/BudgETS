const { Category, Line } = require('../models');
const { categoryDTO } = require('../dto');

// Retourne une catégorie (tous les paramètres) selon l'identificateur envoyé en paramètre
const getCategory = category => {
    return Category.findOne({
        where: category,
        include: Line
    });
}

// Retourne toutes les catégories
const getCategories = () => {
    return Category.findAll({ include: Line });
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
        categoryDTO(category, c);
        return c.save();
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
