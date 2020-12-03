const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const { User, Budget } = require('../models');

// Retourne un utilisateur (tous les paramètres) selon l'identificateur envoyé en paramètre
const getUser = user => {
    return User.findOne({
        where: user,
        raw: true
    });
}

// Retourne tous les utilisateurs
const getUsers = () => {
    return User.findAll({ 
        attributes: ['id', 'username', 'fullname', 'email', 'isBlocked', 'isAdmin', 'deleted']
    });
};

// Ajout d'un utilisateur
const addUser = (user) => {
    user = User.build(user, {raw: true});
    user.password = bcrypt.hashSync(user.password, config.saltRounds);
    return user.save();
}

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUser = user => {
    return User.findOne({
        where: {
            id: user.id
        }
    }).then(u => {
        if (u) {
            u.fullname = user.fullname;
            u.email = user.email;
            if (user.isBlocked || user.isBlocked === false) {
                u.isBlocked = user.isBlocked;
            }
            if (user.isAdmin || user.isAdmin === false) {
                u.isAdmin = user.isAdmin;
            }
            if (user.password && user.password.length > 0) {
                u.password = bcrypt.hashSync(user.password, config.saltRounds);
            }
            if (user.activeBudgetId) {
                u.activeBudgetId = user.activeBudgetId;
            }
            return u.save(); 
        }
        return u;
    });
}

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUserAfterAccess = (userId, budgetId) => {
    return User.findOne({
        where: {
            id: userId
        }
    }).then(u => {
        if (u && u.activeBudgetId == budgetId) {
            u.activeBudgetId = null;
            return u.save(); 
        }
        return u;
    });
}

// Suppression d'un utilisateur selon l'identificateur envoyé en paramètre
const deleteUser = user => {
    return User.findOne({
        where: {
            id: user.id
        }
    }).then(u => {
        if (u) {
            u.deleted = true;
            return u.save(); 
        }
        return u;
    });
}

const getUserActiveBudget = userId => {
    return User.findOne({
        where: {
            id: userId
        },
        include: [{
            model: Budget,
            as: 'activeBudget'
        }]
    });
}

module.exports = {
    getUser,
    getUsers,
    addUser,
    updateUser,
    updateUserAfterAccess,
    deleteUser,
    getUserActiveBudget
};
