const jwt = require('jsonwebtoken');
const config = require('../config/jsonConfig');
const { User } = require('../models');
const userService = require('../services/user');

const verifyAuth = (req, res, next) => {
    // Vérifier l'entête d'autorisation
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'undefined') {
        return res.sendStatus(401);
    }

    // Vérifier la présence du token
    let authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(401).send({ 
            message: 'No authorization token sent.' 
        });
    }

    // Vérifier le contenu du token 
    jwt.verify(authToken, config.jwtSecret, { algorithms: ['HS256'] }, (err, payload) => {
        if (err) {
            //console.log(err);
            return res.status(401).send({ 
                message: 'Token verification failed.' 
            });
        }

        // Ajouter les infos de l'utilisateur à la requête
        userService.getUser({
            id: payload.id
        }).then(user => {
            req.user = User.build(user, {raw: true});
            next();
        }).catch(err => {
            console.log(err);
            return res.status(401).send({
                message: 'An unexpected error occurred'
            });
        })
    });
};

const verifyAdmin = (req, res, next) => {
    if (typeof req.user === 'undefined' || !req.user.isAdmin) {
        return res.status(401).send({
            message: 'Unauthorized'
        });
    }
    next();
};

module.exports = {
    verifyAuth,
    verifyAdmin
};