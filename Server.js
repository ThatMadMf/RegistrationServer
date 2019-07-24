const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const crypto = require('crypto');
const uuid = require('uuid');
const User = require('./Db/RelatedFiles/Schema.js');
const config = require('./config.js');
const connection = require('./Db/RelatedFiles/Connection.js');
const validator = require('email-validator');

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.post('/signup', (req, res) => {
    var status = true;
    for(var key in req.body){
        if(key !== "name" && key !== "email" && key !== "address" && key !== "password" && key !== "confirmPassword") {
            status = false;
        }
    }
    if (req.body.name && req.body.email && req.body.password && req.body.confirmPassword && status === true) {
        connection.db;
        if (req.body.password !== req.body.confirmPassword) {
            res.status(403);
            res.send('passwords are not matching');
        } 
        else {
            if(validator.validate(req.body.email)) {
            var hash = crypto.createHash('md5', config.config.secret).update(req.body.password).digest('hex');
            var CurrentUser = new User({
                id: uuid(req.body.email),
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                password: hash,
                apiKey: uuid(req.body)
            })
            CurrentUser.save(function (err) {
                if (err) {
                    res.status(403);
                    res.send(err);
                    return console.log(err);
                } else {
                    res.status(200);
                    res.send('Data saved successfully')
                }
            })
        }
        else{
            res.status(403);
            res.send('email is not valid');
        }
    }
    } 
    else {
        res.status(403);
        if(status) {
            res.send('Missed some parameters');
        } 
        else {
            res.send('Request has some forbidden value');
        }
        
    }
});

app.use(function (req, res, next) {
    res.status(404).send('<h1>PAGE NOT FOUND</h1>')
});

app.listen(config.config.port);
