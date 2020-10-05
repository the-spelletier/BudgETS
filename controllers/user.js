const { userDTO } = require('../dto');
const userService = require('../services/user');

function get(req, res) {

}

function getAll(req, res) {

}

function create(req, res) {
    let user = userDTO(req.body);
    if (user.username && req.body.password) {
        user.password = req.body.password;
        userService.addUser(user).then((result) => {
            res.status(201).send(userDTO(result));
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let user = userDTO(req.body);
    if (req.params.id && !user.username) {
        user.id = req.params.id;
        userService.updateUser(user).then((result) => {
            if (user) {
                res.send(userDTO(result));
            } else {
                res.status(404).send({ message: "User Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
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