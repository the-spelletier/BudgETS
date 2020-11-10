const { categoryDTO } = require('../dto');
const categoryService = require('../services/category');

function get(req, res) {
    return res.sendStatus(404);
    categoryService.getCategory({ id: req.params.categoryId }).then(category => {
        sendCategory(category, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    let light = typeof req.query.light !== 'undefined';
    let type = typeof req.query.type !== 'undefined' ? req.query.type : false;
    categoryService.getCategories(req.params.budgetId, light, type).then(categories => {
        sendCategory(categories, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getSummary(req, res) {
    let type = typeof req.query.type !== 'undefined' ? req.query.type : false;
    categoryService.getCategoriesSummary(req.params.budgetId, type).then(c => {
        sendCategory(c, res);
    }).catch(err => {
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let category = categoryDTO(req.body);
    if (category.name && category.type && category.budgetId) { 
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
    if (req.params.categoryId && req.body.name) {
        categoryService.updateCategory({
            id: req.params.categoryId,
            name: req.body.name,
            orderNumber: req.body.orderNumber
        }).then(c => {
            sendCategory(c, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    if (req.params.categoryId) {
        categoryService.deleteCategory({
            id: req.params.categoryId
        }).then(result => {
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
    deleteOne,
    getSummary
};