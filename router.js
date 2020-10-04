const authController = require('./controllers/auth');
const budgetController = require('./controllers/budget');
const categoryController = require('./controllers/category');
const entryController = require('./controllers/entry');
const lineController = require('./controllers/line');
const userController = require('./controllers/user');

const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    // ENDPOINTS
    
    // RACINE
    app.get('/', function (req, res) {
        res.status(200);
        res.send({
            message: "Bienvenue dans BudgETS!"
        });
    });

    // AUTHENTIFICATION ENDPOINTS

    // LOGIN : POST
    // Params : { username, password }
    // Returns : Code 200 if authentification is valid
    app.post('/api/login', authController.login);

    // BUDGET ENDPOINTS

    // BUDGET : GET
    // Get last consulted budget
    // Params : None
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/current',
        authMiddleware.verifyAuth,
        budgetController.getCurrent
    );

    // BUDGET : GET
    // Get one budget
    // Params : { id }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:id',
        authMiddleware.verifyAuth,
        budgetController.get
    );

    // BUDGET : GET
    // Get all budgets
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget',
        authMiddleware.verifyAuth,
        budgetController.getAll
    );

    // BUDGET : POST
    // Create a new budget
    // Params : { startDate, endDate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget',
        authMiddleware.verifyAuth,
        budgetController.create
    )

    // BUDGET : PUT
    // Create a new budget
    // Params : { id, startDate, endDate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budget',
        authMiddleware.verifyAuth,
        budgetController.update
    )

    // BUDGET : POST
    // Clone a budget
    // Params : { year, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget/clone/:id',
        authMiddleware.verifyAuth,
        budgetController.clone
    );

    // BUDGET : GET
    // Get a summary and history of specified budget
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/summary/:id',
        authMiddleware.verifyAuth,
        budgetController.getSummary
    );

    // BUDGET : DELETE
    // Delete a budget
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    // app.get(
    //     '/api/budget/:id',
    //     authMiddleware.verifyAuth,
    //     budgetController.delete
    // );

    // BUDGET CATEGORY ENDPOINTS

    // CATEGORY : GET
    // Get the budget category from specified ID
    // Params : { id }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/:id',
        authMiddleware.verifyAuth,
        categoryController.get
    )

    // CATEGORY : GET
    // Get all budget categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category',
        authMiddleware.verifyAuth,
        categoryController.getAll
    );


    // CATEGORY : POST
    // Create a budget category
    // Params :
    // {
    //    budgetId,
    //    category { name, type }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/category',
        authMiddleware.verifyAuth,
        categoryController.create
    );

    // CATEGORY : PUT
    // Updates a budget category
    // Params :
    // {
    //    budgetId,
    //    category { name, type }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/category',
        authMiddleware.verifyAuth,
        categoryController.update
    );

    // CATEGORY : DELETE
    // Deletes a budget category
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/category/:id',
        authMiddleware.verifyAuth,
        categoryController.deleteOne
    );

    // BUDGET LINE ENDPOINTS

    // LINE : GET
    // Get the budget line from specigied ID
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/line/:id',
        authMiddleware.verifyAuth,
        lineController.get
    );

    // LINE : GET
    // Get all the budget lines
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/line/all',
        authMiddleware.verifyAuth,
        lineController.getAll
    );

    // LINE : POST
    // Create a budget line
    // Params :
    // {
    //      budgetId,
    //      line { name, description, estimate, categoryId }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/line',
        authMiddleware.verifyAuth,
        lineController.create
    );

    // LINE : PUT
    // Updates a budget line
    // Params :
    // {
    //      budgetId,
    //      line { name, description, estimate, categoryId }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/line/:id',
        authMiddleware.verifyAuth,
        lineController.update
    );

    // LINE : DELETE
    // Deletes a budget line
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/line/:id',
        authMiddleware.verifyAuth,
        lineController.deleteOne
    );

    // BUDGET ENTRY ENDPOINTS

    // ENTRY : GET
    // Get one entry from specified Id
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/:id',
        authMiddleware.verifyAuth,
        entryController.get
    );

    // ENTRY : GET
    // Get all entries
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/all',
        authMiddleware.verifyAuth,
        entryController.getAll
    );

    // ENTRY : POST
    // Create a budget entry
    // Params :
    // {
    //      budgetId,
    //      entry { type, categoryId, lineId, receiptId, member, description, date, status }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/entry',
        authMiddleware.verifyAuth,
        entryController.create
    );

    // ENTRY : PUT
    // Updates a budget entry
    // Params :
    // {
    //      budgetId,
    //      entry { type, categoryId, lineId, receiptId, member, description, date, status }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/entry/:id',
        authMiddleware.verifyAuth,
        entryController.update
    );

    // ENTRY : DELETE
    // Deletes a budget entry
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/entry/:id',
        authMiddleware.verifyAuth,
        entryController.deleteOne
    );

    // ENTRY : GET
    // Get all revenus
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/revenues',
        authMiddleware.verifyAuth,
        entryController.getRevenues
    );

    // ENTRY : GET
    // Get all expenses
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/expenses',
        authMiddleware.verifyAuth,
        entryController.getExpenses
    );

    // USER ENDPOINTS

    // USER : POST
    // Create user
    // Params : { username, password, isAdmin }
    // Returns : Code 200 if user added successfully
    app.post(
        '/api/user',
        [authMiddleware.verifyAuth, authMiddleware.verifyAdmin],
        userController.create
    );

    // USER : PUT
    // Update user
    // Params : { id, password, isAdmin }
    // Returns : Code 200 if user added successfully
    app.put(
        '/api/user',
        [authMiddleware.verifyAuth, authMiddleware.verifyAdmin],
        userController.update
    );
};