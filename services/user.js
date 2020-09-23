const sequelize = require('../db');
const Users = require('../models').User;
const { Op } = require("sequelize");

// Ajout d'un utilisateur
const addUser = user => Users.create(user);

// Retourne un utilisateur (tous les paramètres) selon l'identificateur envoyé en paramètre
const getUserById = id => Users.findOne({
    where: { id }
});

// Mise à jour d'un utilisateur selon l'identificateur envoyé en paramètre
const updateUser = user => Users.update(user, { where: { id: user.id } });

// Retourne tous les utilisateurs
const getUsers = () => {
    return Users.findAll({ attributes: ['id', 'firstName', 'lastName', 'username', 'RoleId'], 
    where: {
        username: {
            [Op.not]: 'Administrateur'
          }
      }
    })
        .then(sequelize.getValues);
};

module.exports = {
    addUser,
    getUserById,
    getUsers,
    updateUser
};
