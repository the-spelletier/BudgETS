const authService = require('../services/auth');
const userService = require('../services/user');
const config = require('../config');

const Users = require('../models').User;
const Tokens = require('../models').Token;

function login(req, res) {
    return authService
        // Utilise le service d'authentification
        .authenticate(req.body)

        // Valide la création du jeton de session jwt
        .then(token => {
            if (!token) {
                res.status(401).send({
                    message: "Authentication failed"
                });
            } else {
                res.send({
                    token
                })
            }
        })
        .catch(err => {
            console.log(err);
            console.log('an error');
            res.status(401).send({
                message: err.message
            });
        });
}

module.exports = {
    login
};
