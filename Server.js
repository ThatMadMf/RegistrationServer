const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const User = require('./DbFiles/Schema.js');
const config = require('./config.js');
const connection = require('./DbFiles/Connection.js');
const validator = require('email-validator');
const requestvalidator = require('./RequestValidation/Validator.js');

class RequestError extends Error {
}

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.post('/signup', (req, res, next) => {
    var message = requestvalidator.valid(req.body);
    if (message) {
        return next(new RequestError(message));
    }
    connection.db;
    if (req.body.password !== req.body.confirmPassword) {
        return next(new RequestError('Passwords dont match!'));
    }
    else {
        var hash = crypto.createHash('md5', config.config.secret).update(req.body.password).digest('hex');
        var CurrentUser = new User({
            id: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: hash,
            apiKey: uuidv4()
        })
        CurrentUser.save(function (err) {
            if (err) {
                return next(new RequestError(err));
            } else {
                res.status(200);
                res.send('Data saved successfully')
            }
        })
    }
});

app.use(function (req, res, next) {
    res.status(404).send('<h1>PAGE NOT FOUND</h1>')
});

app.use(function (err, req, res, next) {
    if (err instanceof RequestError) {
        res.status(400);
        res.send(err.message);
    } else {
        res.status(500);
        res.send('<h1>Server Error</h1>');
    }
})

app.listen(config.config.port);
