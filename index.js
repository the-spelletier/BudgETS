const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router.js');

const app = express();
const port = process.env.PORT || 3000;

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

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port %s', server.address().port);
});