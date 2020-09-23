const authController = require('./controllers/auth');
const budgetController = require('./controllers/budget');
const categoryController = require('./controllers/category');
const entryController = require('./controllers/entry');
const lineController = require('./controllers/line');

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
        //authMiddleware.checkAuth,
        budgetController.getCurrent
    );

    // BUDGET : GET
    // Get one budget
    // Params : { id }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:id',
        //authMiddleware.checkAuth,
        budgetController.get
    );

    // BUDGET : POST
    // Create a new budget
    // Params : { year, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget',
        //authMiddleware.checkAuth,
        budgetController.create
    )

    // BUDGET : POST
    // Clone a budget
    // Params : { year, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget/clone/:id',
        //authMiddleware.checkAuth,
        budgetController.clone
    );

    // BUDGET : GET
    // Get a summury and history of specified budget
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget/summary/:id',
        //authMiddleware.checkAuth,
        budgetController.getSummary
    );

    // BUDGET CATEGORY ENDPOINTS

    // CATEGORY : GET
    // Get the budget category from specigied ID
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/:id',
        //authMiddleware.checkAuth,
        categoryController.get
    )

    // CATEGORY : GET
    // Get all budget categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/all',
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
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
        '/api/category/:id',
        //authMiddleware.checkAuth,
        categoryController.update
    );

    // CATEGORY : DELETE
    // Deletes a budget category
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/category/:id',
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
        lineController.get
    );

    // LINE : GET
    // Get all the budget lines
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/line/all',
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
        lineController.update
    );

    // LINE : DELETE
    // Deletes a budget line
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/line/:id',
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
        entryController.get
    );

    // ENTRY : GET
    // Get all entries
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/all',
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
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
        //authMiddleware.checkAuth,
        entryController.update
    );

    // ENTRY : DELETE
    // Deletes a budget entry
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/entry/:id',
        //authMiddleware.checkAuth,
        entryController.deleteOne
    );

    // ENTRY : GET
    // Get all revenus
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/revenues',
        //authMiddleware.checkAuth,
        entryController.getRevenues
    );

    // ENTRY : GET
    // Get all expenses
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/expenses',
        //authMiddleware.checkAuth,
        entryController.getExpenses
    );
};