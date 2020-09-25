const bcrypt = require('bcrypt');
const config = require('../config');
const Users = require('../models').User;

const getEntity = user => {
    return (new Users(user)).get({plain: true});
}

// Retourne un utilisateur (tous les paramètres) selon l'identificateur envoyé en paramètre
const getUser = user => {
    return Users.findOne({
        where: user,
        raw: true
    });
}

// Retourne tous les utilisateurs
const getUsers = () => {
    return Users.findAll({ 
        attributes: ['id', 'username', 'attemptFailed', 'isBlocked', 'isAdmin']
    });
};

// Ajout d'un utilisateur
const addUser = (user) => {
    let u = getEntity(user);
    u.password = bcrypt.hashSync(u.password, config.saltRounds);
    return Users.create(u);
}

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUser = user => {
    let u = new Users(user);
    return Users.update(u, { 
        where: { 
            id: user.id 
        } 
    });
}

// Suppression d'un utilisateur selon l'identificateur envoyé en paramètre
const deleteUser = user => {
    return Users.destroy({ 
        where: { 
            id: user.id 
        } 
    });
}

module.exports = {
    getEntity,
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
