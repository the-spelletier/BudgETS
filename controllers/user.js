const userDTO = require('../dto').userDTO;
const userService = require('../services/user');

function get(req, res) {

}

function getAll(req, res) {

}

function create(req, res) {
    if (req.body.username && req.body.password) {
        let user = userDTO(req.body);
        user.password = req.body.password;
        userService.addUser(user).then((result) => {
            res.status(200).send(userDTO(result));
        }).catch(err => {
            res.status(401).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let user = userDTO(req.body);
    if (req.params.id && !req.body.username) {
        user.id = req.params.id;
        req.body.isAdmin = req.body.isAdmin === true;
        userService.updateUser(user).then((result) => {
            res.status(200).send(userDTO(result));
        }).catch(err => {
            res.status(401).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
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