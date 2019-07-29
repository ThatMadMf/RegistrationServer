const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const app = express();
const User = require('./users/schema');
const config = require('./config');
const connection = require('./db/Connection');
const requestvalidator = require('./Validator');
const authenticate = require('./authenticate');
const RequestError = require('./errors/RequestError');
const Post = require('./posts/routes');
const users = require('./users/routes');
const validateRegistration = require('./users/validation').signupreq;
const validateLogin = require('./users/validation').loginreq;

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.post('/signup', (req, res, next) => {
    let message = requestvalidator.Validation(req.body, validateRegistration); 
    if (message) {
        return next(new RequestError(400, message));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new RequestError(400, 'Passwords dont match!'));
    }
    else {
        let hash = crypto.createHash('md5', config.secret).update(req.body.password).digest('hex'); //hashing password
        let CurrentUser = new User({
            id: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: hash,
            apiKey: uuidv4()                                        //creating and saving new user
        })
        CurrentUser.save(function (err) {
            if (err) {
                return next(new RequestError(400, 'For some reason can\'t save user to database'));
            } else {
                res.status(200);
                res.send('Data saved successfully');
            }
        })
    }
});

app.post('/login', (req, res, next) => {
    let message = requestvalidator.Validation(req.body, validateLogin);
    if (message) {
        return next(new RequestError(400, message));
    }
    User.findOne({ email: req.body.email, password: crypto.createHash('md5', config.secret).update(req.body.password).digest('hex') },
        function (err, user) {
            if (err) {
                return next(new RequestError(400, err));
            }
            if (user === null) {
                return next(new RequestError(400, 'Invalid email or password'));
            } else {
                res.status(200);
                res.send({
                    id: user.id, name: user.name, email: user.email,
                    address: user.address, apiKey: user.apiKey
                });
            }
        });

});

app.get('/mysecret', authenticate, (req, res, next) => {
    res.send('This is your secret page, ' + req.user.name);
});

app.use('/users', users);

app.use('/posts', Post);

app.use(function (req, res, next) {
    res.status(404).send('<h1>PAGE NOT FOUND</h1>')
});

app.use(function (err, req, res, next) {
    if (err instanceof RequestError) {
        res.status(err.code);
        res.send(err.message);
    } else {
        console.log(err);
        res.status(500);
        res.send('<h1>Server Error</h1>');
    }
})

app.listen(config.port);

module.exports = RequestError;
