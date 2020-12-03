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
            throw new Error('Invalid credentials');
        }
        if (user.isBlocked){
            throw new Error('Account blocked');
        }
        if (user.deleted){
            throw new Error('Account deleted');
        }
        // Validation du mot de passe via l'encryption
        if (!bcrypt.compareSync(params.password || '', user.password)) {
            throw new Error('Invalid credentials');
        } else {
            // Générer le token
            const payload = {
                id: user.id,
                name: user.username,
                admin: user.isAdmin
            };
            return {
                token: jwt.sign(payload, config.jwtSecret, {
                    algorithm: config.jwtAlgo,
                    expiresIn: config.ttl
                }),
                isAdmin: user.isAdmin
            };
        }
    }).catch(err => {
        throw err;
    });
};

module.exports = {
    authenticate
};