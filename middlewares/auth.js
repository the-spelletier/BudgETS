const jwt = require('jsonwebtoken');
const config = require('../config');
const Users = require('../models').User;
const userService = require('../services/user');

const verifyAuth = (req, res, next) => {

    // Vérifier l'entête d'autorisation
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'undefined') {
        return res.sendStatus(403);
    }

    // Vérifier la présence du token
    let authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(403).send({ 
            auth: false, 
            message: 'No authorization token sent.' 
        });
    }

    // Vérifier le contenu du token 
    jwt.verify(authToken, config.jwtSecret, { algorithms: ['HS256'] }, (err, payload) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ 
                auth: false, 
                message: 'Token verification failed.' 
            });
        }

        // Ajouter les infos de l'utilisateur à la requête
        userService.getUser({
            id: payload.id
        }).then(user => {
            req.user = Users.build(user, {raw: true});
            next();
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                auth: false,
                message: 'An unexpected error occurred'
            });
        })
    });
};

const verifyAdmin = (req, res, next) => {
    if (typeof req.user === 'undefined' || !req.user.isAdmin) {
        return res.status(403).send({
            message: 'Unauthorized'
        });
    }
    next();
};

module.exports = {
    verifyAuth,
    verifyAdmin
};