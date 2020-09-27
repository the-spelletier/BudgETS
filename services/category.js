const Category = require('../models').Category;

// Retourne une catégorie (tous les paramètres) selon l'identificateur envoyé en paramètre
const getCategory = category => {
    return Category.findOne({
        where: category
    });
}

// Retourne toutes les catégories
const getCategories = () => {
    return Category.findAll();
};

// Ajout d'une catégorie
const addCategory = category => {
    return Category.create(category);
}

// Mise à jour d'une catégorie selon l'identificateur envoyé en paramètre
const updateCategory = category => {
    return Category.update(category, { 
        where: { 
            id: category.id 
        } 
    });
}

// Suppression d'une catégorie selon l'identificateur envoyé en paramètre
const deleteCategory = category => {
    return Category.findOne({ 
        where: { 
            id: category.id 
        } 
    }).then(cat => {
      // La catégorie existe
      if(!cat){
        return ; // TODO : Add error? 
      }
      // La catégorie n'a aucune lignes
      if(cat.lines.lenght!=0){
        return ; // TODO : Add error? 
      }
      // Suppression
      return Category.destroy({ 
        where: { 
            id: category.id 
        } 
      });
    });
}

module.exports = {
    getCategory,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
};
