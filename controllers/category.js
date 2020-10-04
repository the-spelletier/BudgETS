const categoryDTO = require('../dto').categoryDTO;
const categoryService = require('../services/category');

function get(req, res) {
    categoryService.getCategory({
        id: req.params.id
    }).then(category => {
        sendCategory(category, res);
    });
}

function getAll(req, res) {
    categoryService.getCategories().then(categories => {
        categories.forEach((b, i, arr) => {
            arr[i] = categoryDTO(b);
        });
        res.send(categories);
    });
}

function create(req, res) {
    if (req.body.name, req.body.type, req.body.budgetId) { 
        categoryService.addCategory(req.body).then((result) => {
            console.log(result);
            res.status(200).send(categoryDTO(result));
        }).catch(err => {
            res.status(401).send({ message: 'Validation error' });
        });
    } else {
        res.status(403).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
  categoryService.updateCategory(req.body).then(result => {
    res.status(200).send(categoryDTO(result));
  }).catch(err => {
    res.status(401).send({ message: err.message });
  });
}

function deleteOne(req, res) {
  categoryService.deleteCategory(categoryDTO(req.params)).then(result => {
    res.status(200).send();
  }).catch(err => {
    res.status(401).send({ message: err.message });
  });
}

function sendCategory(category, res) {
    if (category) {
        res.send(categoryDTO(category));
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