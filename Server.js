const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const Ajv = require('ajv');
const ajv = Ajv();
const app = express();
const User = require('./DbFiles/Schema');
const config = require('./config');
const connection = require('./DbFiles/Connection');
const requestvalidator = require('./RequestValidation/Validator');
const authenticate = require('./Authenticate');
const RequestError = require('./RequestError');
const authorize = require('./Authorize');
const validateRegistration = ajv.compile(require('./RequestValidation/Schema').Schema);
const validateLogin = ajv.compile(require('./RequestValidation/Schema').Request);

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
        let hash = crypto.createHash('md5', config.secret).update(req.body.password).digest('hex');
        let CurrentUser = new User({
            id: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: hash,
            apiKey: uuidv4()
        })
        CurrentUser.save(function (err) {
            if (err) {
                if (err)
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
                res.send({id: user.id, name: user.name, email: user.email, 
                    address: user.address, apiKey: user.apiKey});
            }
        });

});

app.get('/mysecret', authenticate, (req, res, next) => {
    console.log(typeof req.ReqErr);
    res.send('This is your secret page, ' + req.user.name);
});

app.put('/users/:userId', authenticate, authorize, (req, res, next) => {
    User.findOneAndUpdate(req.user.apiKey, req.body,
        function(err) {
            if(err) {
                return next(new RequestError(400, err));
            }
            else {
                console.log('user upd');
                res.status(200);
                res.send('complete');
            }
        });
});

app.delete('/users/:userId', authenticate, authorize, (req, res, next) => {
    console.log('in delete');
    User.findOneAndDelete(req.user.apiKey, 
        function(err) {
            if(err) {
                return next(new RequestError(400, err));
            }
            else {
                console.log('deleted');
                res.status(200);
                res.send('deleted');
            }
        });
});

app.get('/users/:userId', authenticate, (req, res, next) => {
    User.findOne({id: req.params.userId}, 
        function(err, user) {
            if(err) {
                return next(new RequestError(400, err));
            }
            else {
                res.status(200);
                res.send({id: user.id, name: user.name, email: user.email, 
                    address: user.address});
            }
        });
});

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
