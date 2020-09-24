const authService = require('../services/auth');
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
                    message: "Failed"
                });
            } else {

                // Trouve l'utilisateur et ajoute son Id au token
                userService.getUser({
                    username: req.body.username
                }).then(user => {
                    var t = { value: token, ttl: config.ttl, UserId: user.id };
                    Tokens.create(t).then(token =>
                        res.send({
                            token
                        })
                    );
                });
            }
        })
        .catch(err => {
            res.status(401).send({
                message: err.message
            });
        });
}

module.exports = {
    login
};
