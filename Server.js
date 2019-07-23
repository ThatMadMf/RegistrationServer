const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

var User = require('./Db/RelatedFiles/Shema.js');

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.post('/registration', (req, res) => {
    if (req.body.name && req.body.email && req.body.password && req.body.confirmPassword) {
        var CurrentUser = new User({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        mongoose.connect("mongodb://localhost:27017/MyDb", { useNewUrlParser: true });
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            // we're connected!
        });
        CurrentUser.save(function (err) {
            if (err) {
                return console.error(err);
            }
        })
        res.status(200);
        res.send(JSON.stringify(req.body));
    } else {
        res.status(303);
        res.send('Missed some parameters');
    }
});

app.use(function (req, res, next) {
    res.status(404).send('<h1>PAGE NOT FOUND</h1>')
});

app.listen(8080);
