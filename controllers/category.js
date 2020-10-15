const { categoryDTO } = require('../dto');
const categoryService = require('../services/category');

function get(req, res) {
    categoryService.getCategory(categoryDTO(req.params)).then(category => {
        sendCategory(category, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    categoryService.getCategories(categoryDTO(req.params)).then(categories => {
        console.log(categories);
        sendCategory(categories, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let category = categoryDTO(req.body);
    if (category.name, category.type, category.budgetId) { 
        categoryService.addCategory(category).then(c => {
            res.status(201);
            sendCategory(c, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let category = categoryDTO(req.body);
    if (req.params.id) {
        category.id = req.params.id;
        categoryService.updateCategory(category).then(c => {
            sendCategory(c, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    let category = categoryDTO(req.params);
    if (category.id) {
        categoryService.deleteCategory(category).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Category Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendCategory(category, res) {
    if (category) {
        let categoryRes;
        if (Array.isArray(category)) {
            category.forEach((b, i, arr) => {
                arr[i] = categoryDTO(b);
            });
            categoryRes = category;
        } else {
            categoryRes = categoryDTO(category);
        }
        res.send(categoryRes);
    } else {
        res.status(404).send({ message: "Category Not Found" });
    }
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};