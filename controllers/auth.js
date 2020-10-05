const authService = require('../services/auth');

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
            res.status(401).send({
                message: "An unexpected error occurred"
            });
        });
}

module.exports = {
    login
};
