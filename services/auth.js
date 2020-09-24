const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models').User;
const Tokens = require('../models').Token;
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
                userId: null
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
                userId: user.id
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

            var sesslog = {
                loginSucceeded: true,
                userId: user.id
            };
            // Journalisation de la réussite d'authentification
            SessionLogs.create(sesslog);

            // Trouver/générer le token
            return Tokens.findOne({
                where: {
                    userId: user.id
                },
                raw: true
            }).then(t => {
                if (!t || isExpired(t)) {
                    t = generateToken(user);
                }

                delete user["id"];
                delete user["createdAt"];
                delete user["updatedAt"];
                delete user["userId"];
                return t;
            });
        }
    }).catch(err => {throw err});;
};

const isExpired = token => {
    let createdAt = Math.floor((new Date(token.createdAt)).getTime()/1000);
    let now = Math.floor(Date.now()/1000);
    return now > createdAt + token.ttl;
}

const generateToken = user => {
    const payload = {
        id: user.id,
        username: user.username,
        attemptFailed: user.attemptFailed,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin
    };

    token = jwt.sign(payload, config.jwtSecret, {
        algorithm: 'HS256',
        expiresIn: config.ttl
    });

    return Tokens.create({ 
        value: token, 
        ttl: config.ttl, 
        userId: user.id 
    }).then(res => {
        return res.get({plain:true})
    });
}

module.exports = {
    authenticate
};