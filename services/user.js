const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const { User } = require('../models');

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
        attributes: ['id', 'username', /*'attemptFailed', 'isBlocked',*/ 'isAdmin']
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
            u.isAdmin = user.isAdmin;
            if (user.password) {
                u.password = bcrypt.hashSync(user.password, config.saltRounds);
            }
            return u.save(); 
        }
        return u;
    });
}

// Suppression d'un utilisateur selon l'identificateur envoyé en paramètre
const deleteUser = user => {
    return User.destroy({ 
        where: { 
            id: user.id 
        } 
    });
}

module.exports = {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
