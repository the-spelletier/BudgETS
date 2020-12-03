const { userDTO } = require('../dto');
const userService = require('../services/user');

function get(req, res) {
    userService.getUser({
        id: req.params.userId
    }).then(user => {
        sendUser(user, res);
    }).catch(err => {
        res.status(403).send({ message: 'Validation error' });
    });
}

function getAll(req, res) {
    userService.getUsers().then(users => {
        users = users.filter(u => u.id != req.user.id);
        sendUser(users, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    if (req.body.username && req.body.password && req.body.isAdmin != null) {
        userService.addUser(req.body).then((u) => {
            sendUser(u, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    if (req.params.userId && !req.body.username && !req.body.activeBudgetId) {

        let user = { id: req.params.userId };
        user.fullname = req.body.fullname;
        user.email = req.body.email;
        if (req.body.isBlocked || req.body.isBlocked === false) {
            user.isBlocked = req.body.isBlocked;
        }
        if (req.body.isAdmin || req.body.isAdmin === false) {
            user.isAdmin = req.body.isAdmin;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.activeBudgetId) {
            user.activeBudgetId = req.body.activeBudgetId;
        }
        
        userService.updateUser(user).then((u) => {
            sendUser(u, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.userId) {
        userService.deleteUser({
            id: req.params.userId
        }).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "User Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendUser(user, res) {
    if (user) {
        let userRes;
        if (Array.isArray(user)) {
            user.forEach((e, i, arr) => {
                arr[i] = userDTO(e);
            });
            userRes = user;
        } else {
            userRes = userDTO(user);
        }
        res.send(userRes);
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};