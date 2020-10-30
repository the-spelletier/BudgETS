const authController = require('./controllers/auth');
const budgetController = require('./controllers/budget');
const categoryController = require('./controllers/category');
const entryController = require('./controllers/entry');
const lineController = require('./controllers/line');
const userController = require('./controllers/user');
const memberController = require('./controllers/member');

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

    // BUDGET : GET
    // Get a summary and history of specified budget
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:id/summary',
        authMiddleware.verifyAuth,
        budgetController.getSummary
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
    // Update a budget
    // Params : { id, startDate, endDate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budget/:id',
        authMiddleware.verifyAuth,
        budgetController.update
    )

    // BUDGET : POST
    // Clone a budget
    // Params : { startdate, enddate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget/:id/clone',
        authMiddleware.verifyAuth,
        budgetController.clone
    );

    // BUDGET : DELETE
    // Delete a budget
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    // app.delete(
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
        '/api/budget/:budgetId/category',
        authMiddleware.verifyAuth,
        categoryController.getAll
    );

    // BUDGET : GET
    // Get a summary of the specified budget, grouped by categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/category/summary',
        authMiddleware.verifyAuth,
        categoryController.getSummary
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
        '/api/category/:id',
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
    // Get the budget line from specified ID
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/line/:id',
        authMiddleware.verifyAuth,
        lineController.get
    );


    // LINE : GET
    // Get all the budget category lines
    // Params : { categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/:categoryId/line',
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
    // Params : { entryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/:id',
        authMiddleware.verifyAuth,
        entryController.get
    );

    // ENTRY : GET
    // Get all budget entries
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/entry',
        authMiddleware.verifyAuth,
        entryController.getAll
    );

    // ENTRY : POST
    // Create a budget entry
    // Params :
    // {
    //      budgetId,
    //      entry { type, categoryId, lineId, receiptCode, member, description, date, status }
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

    // USER MEMBER ENDPOINTS

    // MEMBER : GET
    // Get the member from specified ID
    // Params : { memberId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/member/:id',
        authMiddleware.verifyAuth,
        memberController.get
    );


    // MEMBER : GET
    // Get all the user's members
    // Params : { userId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/members',
        authMiddleware.verifyAuth,
        memberController.getAll
    );

    // MEMBER : POST
    // Create a user member
    // Params :
    // {
    //      member { userId, name,  code, email }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/member',
        authMiddleware.verifyAuth,
        memberController.create
    );

    // MEMBER : PUT
    // Updates a user's member
    // Params :
    // {
    //      memberId,
    //      member { name, code, email }
    // }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/member/:id',
        authMiddleware.verifyAuth,
        memberController.update
    );

    // MEMBER : DELETE
    // Deletes a member
    // Params : { memberId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/member/:id',
        authMiddleware.verifyAuth,
        memberController.deleteOne
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
        '/api/user/:id',
        [authMiddleware.verifyAuth, authMiddleware.verifyAdmin],
        userController.update
    );
};