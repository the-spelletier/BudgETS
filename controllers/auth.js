const authService = require('../services/auth');

const Users = require('../models').User;
const Tokens = require('../models').Token;

function login(req, res) {
    return authService
        // Utilise le service d'authentification
        .authenticate(req.body)

        // Valide la création du jeton de session jwt
        .then(token => {

            if (!token) {
                res.status(401);
                res.send({
                    message: "Failed"
                });
            } else {

                // Trouve l'utilisateur et ajoute son Id au token
                Users.findOne({
                    where: {
                        username: req.body.username
                    },
                    raw: true
                }).then(user => {
                    var t = { value: token, ttl: 28800, UserId: user.id };
                    Tokens.create(t).then(token =>
                        res.send({
                            token
                        })
                    );
                });
            }
        })
        .catch(err => {
            res.status(401);
            res.send({
                message: err.message
            });
        });
}

module.exports = {
    login
};
