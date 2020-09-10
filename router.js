module.exports.set = app => {
    // ENDPOINTS

    app.get('/', function (req, res) {
        res.send('Welcome to BudgETS!')
    });
};