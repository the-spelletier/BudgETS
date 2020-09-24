const jwt = require('jsonwebtoken');
const config = require('../config');

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
    jwt.verify(authToken, config.jwtSecret, (err, content) => {
        if (err) {
            return res.status(500).send({ 
                auth: false, 
                message: 'Token verification failed.' 
            });
        }

        // Ajouter les infos de l'utilisateur à la requête
        req.user = {
            id: content.id,
            username: content.username,
            attemptFailed: content.attemptFailed,
            isBlocked: content.isBlocked,
            isAdmin: content.isAdmin
        };
        next();
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