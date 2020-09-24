const bcrypt = require('bcrypt');
const config = require('../config');
const Users = require('../models').User;

// Retourne un utilisateur (tous les paramètres) selon l'identificateur envoyé en paramètre
const getUser = user => {
    return Users.findOne({
        where: user
    });
}

// Retourne tous les utilisateurs
const getUsers = () => {
    return Users.findAll({ 
        attributes: ['id', 'username', 'attemptFailed', 'isBlocked', 'isAdmin']
    });
};

// Ajout d'un utilisateur
const addUser = user => {
    const hashedPw = bcrypt.hashSync(user.password, config.saltRounds);
    user.password = hashedPw;
    return Users.create(user).then(res => {
        res = res.get({plain: true});
        delete res.password;
        delete res.updatedAt;
        delete res.createdAt;
        return res;
    });
}

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUser = user => {
    return Users.update(user, { 
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
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
