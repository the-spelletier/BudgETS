const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router.js');

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    cors({
        origin: '*'
    })
);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

router.set(app);

module.exports = app;