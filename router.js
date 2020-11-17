const authController = require('./controllers/auth');
const budgetController = require('./controllers/budget');
const categoryController = require('./controllers/category');
const entryController = require('./controllers/entry');
const entryStatusController = require('./controllers/entryStatus');
const lineController = require('./controllers/line');
const userController = require('./controllers/user');
const memberController = require('./controllers/member');
const cashflowController = require('./controllers/cashflow');

const authMiddleware = require('./middlewares/auth');
const accessMiddleware = require('./middlewares/access');

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
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
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
        '/api/budget/:budgetId/summary',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
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
    // Params : { budgetId, startDate, endDate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/budget/:budgetId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isBudgetOwner],
        budgetController.update
    )

    // BUDGET : POST
    // Clone a budget
    // Params : { budgetId, startDate, endDate, name }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/budget/:budgetId/clone',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isBudgetOwner],
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

    // CATEGORY ENDPOINTS

    // CATEGORY : GET
    // Get the budget category from specified ID
    // Params : { categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/:categoryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasCategoryAccess],
        categoryController.get
    )

    // CATEGORY : GET
    // Get all budget categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/category',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
        categoryController.getAll
    );

    // CATEGORY : GET
    // Get a summary of the specified budget, grouped by categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/category/summary',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
        categoryController.getSummary
    );

    // CATEGORY : POST
    // Create a budget category
    // Params : { name, type, budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/category',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isBudgetOwner],
        categoryController.create
    );

    // CATEGORY : PUT
    // Updates a budget category
    // Params : { categoryId, name, type }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/category/:categoryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isCategoryOwner],
        categoryController.update
    );

    // CATEGORY : DELETE
    // Deletes a budget category
    // Params : { categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/category/:categoryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isCategoryOwner],
        categoryController.deleteOne
    );

    // CASHFLOW ENDPOINTS

    // CASHFLOW : GET
    // Get a summary of the specified budget, grouped by categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/category/cashflow/estimate',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
        categoryController.getEstimateCashflows
    );

    // CASHFLOW : GET
    // Get a summary of the specified budget, grouped by categories
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/category/cashflow/real',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
        categoryController.getRealCashflows
    );

    // CASHFLOW : POST
    // Create a cashflow estimate for a specified year & month
    // Params : { categoryId, year, month, estimate }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/cashflow',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isCategoryOwner],
        cashflowController.create
    );

    // CASHFLOW : PUT
    // Updates a cashflow estimate
    // Params : { cashflowId, , estimate }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/cashflow/:cashflowId',
        // authMiddleware.verifyAuth,
        // TODO create isCashflowOwner
        // [authMiddleware.verifyAuth, accessMiddleware.isCashflowOwner],
        [authMiddleware.verifyAuth],
        cashflowController.update
    );

    // BUDGET LINE ENDPOINTS

    // LINE : GET
    // Get the budget line from specified ID
    // Params : { lineId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/line/:lineId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasLineAccess],
        lineController.get
    );


    // LINE : GET
    // Get all the budget category lines
    // Params : { categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/category/:categoryId/line',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasCategoryAccess],
        lineController.getAll
    );

    // LINE : POST
    // Create a budget line
    // Params : { name, description, estimate, categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/line',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isCategoryOwner],
        lineController.create
    );

    // LINE : PUT
    // Updates a budget line
    // Params : { lineId, name, description, estimate, categoryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/line/:lineId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isLineOwner],
        lineController.update
    );

    // LINE : DELETE
    // Deletes a budget line
    // Params : { lineId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/line/:lineId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isLineOwner],
        lineController.deleteOne
    );

    // BUDGET ENTRY ENDPOINTS

    // ENTRY : GET
    // Get one entry from specified Id
    // Params : { entryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/entry/:entryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasEntryAccess],
        entryController.get
    );

    // ENTRY : GET
    // Get all budget entries
    // Params : { budgetId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/budget/:budgetId/entry',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.hasBudgetAccess],
        entryController.getAll
    );

    // ENTRY : POST
    // Create a budget entry
    // Params : { type, lineId, receiptCode, member, description, date, status }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/entry',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isLineOwner],
        entryController.create
    );

    // ENTRY : PUT
    // Updates a budget entry
    // Params : { type, lineId, receiptId, member, description, date, status }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/entry/:entryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isEntryOwner],
        entryController.update
    );

    // ENTRY : DELETE
    // Deletes a budget entry
    // Params : { entryId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/entry/:entryId',
        // authMiddleware.verifyAuth,
        [authMiddleware.verifyAuth, accessMiddleware.isEntryOwner],
        entryController.deleteOne
    );

    // ENTRY STATUS ENDPOINTS

    // STATUS : GET
    // Get all entry statuses
    // Params : {}
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/status',
        authMiddleware.verifyAuth,
        entryStatusController.getAll
    );

    // USER MEMBER ENDPOINTS

    // MEMBER : GET
    // Get the member from specified ID
    // Params : { memberId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.get(
        '/api/member/:memberId',
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
    // Params : { userId, name,  code, email }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.post(
        '/api/member',
        authMiddleware.verifyAuth,
        memberController.create
    );

    // MEMBER : PUT
    // Updates a user's member
    // Params : { memberId, name, code, email }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.put(
        '/api/member/:memberId',
        authMiddleware.verifyAuth,
        memberController.update
    );

    // MEMBER : DELETE
    // Deletes a member
    // Params : { memberId }
    // Requires user to be authentified
    // Returns : Code 200 if user is authentified
    app.delete(
        '/api/member/:memberId',
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
        '/api/user/:userId',
        [authMiddleware.verifyAuth, authMiddleware.verifyAdmin],
        userController.update
    );
};