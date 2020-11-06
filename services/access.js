const { Op } = require('sequelize');
const { Access } = require('../models');

// Retourne un access selon l'identificateur envoyé en paramètre
const getAccess = access => {
    return Access.findOne({
        where: access
    });
}

// Retourne tous les accesss
const getAccesses = access => {
    return Access.findAll({ 
        where: access
    });
};

// Ajout d'un access
const addAccess = access => {
    access = Access.build(access, {raw: true});
    return access.save();
}

// Suppression d'un access selon l'identificateur envoyé en paramètre
const deleteAccess = access => {
    return Access.destroy({ 
        where: { 
            budgetId: access.budgetId,
            userId: access.userId
        } 
    });
}

module.exports = {
    getAccess,
    getAccesses,
    addAccess,
    deleteAccess
};
