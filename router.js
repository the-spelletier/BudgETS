const authController = require('./controllers/auth');
const budgetController = require('./controllers/budget');
const budgetCategoryController = require('./controllers/budgetCategory');
const budgetEntryController = require('./controllers/budgetEntry');
const budgetLineController = require('./controllers/budgetLine');

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
    // Get the budget from the specified year, or the last consulted if not specified
    // Params : (optional) Année du budget
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget',
        //authMiddleware.checkAuth,
        budgetController.get
    );

    // BUDGET : POST
    // Create a new budget
    // Params : ?????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget',
        //authMiddleware.checkAuth,
        budgetController.create
    );

    // BUDGET CATEGORY ENDPOINTS

    // BUDGET_CATEGORY : GET
    // Get the budget category from specigied ID, or all of them if not specified
    // Params : (optional) Id
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budgetCategory',
        //authMiddleware.checkAuth,
        budgetCategoryController.get
    );


    // BUDGET_CATEGORY : POST
    // Create a budget category
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budgetCategory',
        //authMiddleware.checkAuth,
        budgetCategoryController.create
    );

    // BUDGET_CATEGORY : PUT
    // Updates a budget category
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budgetCategory',
        //authMiddleware.checkAuth,
        budgetCategoryController.update
    );

    // BUDGET_CATEGORY : DELETE
    // Deletes a budget category
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/budgetCategory',
        //authMiddleware.checkAuth,
        budgetCategoryController.delete
    );

    // BUDGET LINE ENDPOINTS

    // BUDGET_LINE : GET
    // Get the budget line from specigied ID, or all of them if not specified
    // Params : (optional) Id
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budgetLine',
        //authMiddleware.checkAuth,
        budgetLineController.get
    );

    // BUDGET_LINE : POST
    // Create a budget line
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budgetLine',
        //authMiddleware.checkAuth,
        budgetLineController.create
    );

    // BUDGET_LINE : PUT
    // Updates a budget line
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budgetLine',
        //authMiddleware.checkAuth,
        budgetLineController.update
    );

    // BUDGET_LINE : DELETE
    // Deletes a budget line
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/budgetLine',
        //authMiddleware.checkAuth,
        budgetLineController.delete
    );

    // BUDGET ENTRY ENDPOINTS

    // BUDGET_ENTRY : GET
    // Get the budget entry from specigied ID, or all of them if not specified
    // Get all expenses if type is specified (Type=expenses), else
    // Get all revenus if type is specified (Type=revenus), else all budget entries
    // Params : (optional) Id, (optional) Type
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budgetEntry',
        //authMiddleware.checkAuth,
        budgetEntryController.get
    );

    // BUDGET_ENTRY : POST
    // Create a budget entry
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budgetEntry',
        //authMiddleware.checkAuth,
        budgetEntryController.create
    );

    // BUDGET_ENTRY : PUT
    // Updates a budget entry
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budgetEntry',
        //authMiddleware.checkAuth,
        budgetEntryController.update
    );

    // BUDGET_ENTRY : DELETE
    // Deletes a budget entry
    // Params : ????
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/budgetEntry',
        //authMiddleware.checkAuth,
        budgetEntryController.delete
    );
};