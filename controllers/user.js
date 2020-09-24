const userService = require('../services/user');

function get(req, res) {

}

function getAll(req, res) {

}

function create(req, res) {
    if (req.body.user && req.body.user.username && req.body.user.password) {
        userService.addUser(req.body.user).then((result) => {
            console.log(result);
            res.status(200).send(result);
        }).catch(err => {
            res.status(401).send({
                message: err.message
            });
        });
    } else {
        return res.status(403).send({ 
            message: 'Invalid parameters' 
        });
    }
}

function update(req, res) {

}

function deleteOne(req, res) {

}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};