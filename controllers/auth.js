const authService = require('../services/auth');

function login(req, res) {
    return authService
        // Utilise le service d'authentification
        .authenticate(req.body)

        // Valide la création du jeton de session jwt
        .then(result => {
            if (!result) {
                res.status(401).send({ message: "Authentication failed" });
            } else {
                res.send(result);
            }
        })
        .catch(err => {
            res.status(401).send({ message: "Authentication failed" });
        });
}

module.exports = {
    login
};
