const userDTO = require('../dto').userDTO;
const userService = require('../services/user');

function get(req, res) {

}

function getAll(req, res) {

}

function create(req, res) {
    if (req.body.username && req.body.password) {
        req.body.isAdmin = req.body.isAdmin === true;
        userService.addUser(req.body).then((result) => {
            res.status(200).send(userDTO(result));
        }).catch(err => {
            res.status(401).send({ message: err.message });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
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