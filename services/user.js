const bcrypt = require('bcrypt');
const config = require('../config');
const Users = require('../models').User;

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
    user = Users.build(user, {raw: true});
    user.password = bcrypt.hashSync(user.password, config.saltRounds);
    return user.save();
}

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUser = user => {
    return Users.findOne({
        where: {
            id: user.id
        }
    }).then(u => {
        console.log(u);
        u.isAdmin = user.isAdmin;
        if (user.password) {
            u.password = bcrypt.hashSync(user.password, config.saltRounds);
        }
        return u.save();
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
