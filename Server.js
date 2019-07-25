const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const User = require('./DbFiles/Schema');
const config = require('./config');
const connection = require('./DbFiles/Connection');
const requestvalidator = require('./RequestValidation/Validator');
const authenticate = require('./ApiKey');
const RequestError = require('./RequestError');
const change = require('./ChangeParams');

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.post('/signup', (req, res, next) => {
    var message = requestvalidator.validReg(req.body);
    if (message) {
        return next(new RequestError(400, message));
    }
    connection.db;
    if (req.body.password !== req.body.confirmPassword) {
        return next(new RequestError(400, 'Passwords dont match!'));
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
                if (err.code = 11000)
                    return next(new RequestError(400, 'There is the email in database'));
            } else {
                res.status(200);
                res.send('Data saved successfully');
            }
        })
    }
});

app.post('/login', (req, res, next) => {
    var message = requestvalidator.validLog(req.body);
    if (message) {
        return next(new RequestError(400, message));
    }
    connection.db;
    User.find({ email: req.body.email, password: crypto.createHash('md5', config.config.secret).update(req.body.password).digest('hex') },
        function (err, user) {
            if (err) {
                return next(new RequestError(err));
            }
            if (user.length === 0) {
                return next(new RequestError(400, 'Invalid email or password'));
            } else {
                res.status(200);
                res.send('User ' + user[0].id + 'ApiKey: ' + user[0].apiKey + ' logged in');
            }
        });

});
var result;
app.get('/mysecret', authenticate, (req, res, next) => {
    console.log(typeof req.ReqErr);
    if (req.ReqErr) {
        return next(new RequestError(req.ReqErr.code, req.ReqErr.message));
    } else {
        res.send('This is your secret page, ' + req.user.name);
    }
});

app.put('/users/:userId',authenticate, change, (req, res, next) => {
    if (req.ReqErr) {
        return next(new RequestError(req.ReqErr.code, req.ReqErr.message));
    } else {
        res.send('it\'s complete');
    }
    
});

app.use(function (req, res, next) {
    res.status(404).send('<h1>PAGE NOT FOUND</h1>')
});

app.use(function (err, req, res, next) {
    if (err instanceof RequestError) {
        res.status(err.code);
        res.send(err.message);
    } else {
        res.status(500);
        res.send('<h1>Server Error</h1>');
    }
})

app.listen(config.config.port);

module.exports = RequestError;
