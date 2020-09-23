const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models').User;
const SessionLogs = require('../models').SessionLog;

const config = require('../config');
const userService = require('../services/user');

const authenticate = params => {
    // Retourne un utilisateur selon le nom d'utilisateur envoyé en paramètre
    return Users.findOne({
        where: {
            username: params.username
        },
        raw: true
    }).then(user => {
        if (!user) {
            // Journalisation de l'échec d'authentification (Utilisateur qui n'existe pas)
            var sesslog = {
                loginSucceeded: false,
                UserId: null
            };
            SessionLogs.create(sesslog);
            throw new Error('Authentication failed. Wrong user or password.');
        }
        // Validation du mot de passe via l'encryption
        if (!bcrypt.compareSync(params.password || '', user.password)) {
            // Journalisation de l'échec d'authentification (Mauvais mot de passe )
            // et mise à jour du nombre de tentatives échouées
            var sesslog = {
                loginSucceeded: false,
                UserId: user.id
            };
            SessionLogs.create(sesslog);
            var userToUpdate = {
                id: user.id,
                attemptFailed: user.attemptFailed + 1
            }
            userService.updateUser(userToUpdate);
            throw new Error('Authentication failed. Wrong user or password.');
        } else {
            // Remise à zéro pour le nombre de tentatives et déblocage du compte
            var userToUpdate = {
                id: user.id,
                attemptFailed: 0,
                isBlocked : false
            }
            userService.updateUser(userToUpdate);

            const payload = {
                login: user.username,
                id: user.id,
                role: user.RoleId
            };

            var token = jwt.sign(payload, config.jwtSecret, {
                algorithm: 'HS256',
                expiresIn: config.tokenExpireTime
            });
            var sesslog = {
                loginSucceeded: true,
                UserId: user.id
            };
            // Journalisation de la réussite d'authentification
            SessionLogs.create(sesslog);
            return token;
        }
    }).catch(err => {throw err});;
};

module.exports = {
    authenticate
};