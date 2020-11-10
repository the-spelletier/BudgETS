const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const SessionLogs = require('../test').SessionLog;

const config = require('../config/jsonConfig');
const userService = require('../services/user');

const authenticate = params => {
    // Retourne un utilisateur selon le nom d'utilisateur envoyé en paramètre
    return userService.getUser({ 
        username: params.username 
    }).then(user => {
        if (!user) {
            // Journalisation de l'échec d'authentification (Utilisateur qui n'existe pas)
            /*var sesslog = {
                loginSucceeded: false,
                userId: null
            };
            SessionLogs.create(sesslog);*/
            throw new Error('Invalid credentials');
        }
        // Validation du mot de passe via l'encryption
        if (!bcrypt.compareSync(params.password || '', user.password)) {
            // Journalisation de l'échec d'authentification (Mauvais mot de passe )
            // et mise à jour du nombre de tentatives échouées
            /*var sesslog = {
                loginSucceeded: false,
                userId: user.id
            };
            SessionLogs.create(sesslog);
            var userToUpdate = {
                id: user.id,
                attemptFailed: user.attemptFailed + 1
            }
            userService.updateUser(userToUpdate);*/
            throw new Error('Invalid credentials');
        } else {
            // Remise à zéro pour le nombre de tentatives et déblocage du compte
            // TODO : very bad for unit testing. Can't write-access table if testing access of one other.
            /*var userToUpdate = {
                id: user.id,
                attemptFailed: 0,
                isBlocked : false
            }
            userService.updateUser(userToUpdate);*/

            /*var sesslog = {
                loginSucceeded: true,
                userId: user.id
            };
            // Journalisation de la réussite d'authentification
            SessionLogs.create(sesslog);*/

            // Générer le token
            const payload = {
                id: user.id,
                name: user.username,
                admin: user.isAdmin
            };
            return jwt.sign(payload, config.jwtSecret, {
                algorithm: config.jwtAlgo,
                expiresIn: config.ttl
            });
        }
    }).catch(err => {
        throw err;
    });
};

module.exports = {
    authenticate
};