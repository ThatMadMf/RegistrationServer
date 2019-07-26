const express = require('express');
const authenticate = require('./Authenticate');
const authorize = require('./Authorize');
const Ajv = require('ajv');
const ajv = Ajv();
const requestvalidator = require('./RequestValidation/Validator');
const validatePost = ajv.compile(require('./RequestValidation/Schema').Post);
const validatePut = ajv.compile(require('./RequestValidation/Schema').Put);
const Post = require('./DbFiles/PostSchema');
const RequestError = require('./RequestError');
const router = express.Router();


router.post('/', authenticate, authorize, (req, res, next) => {
    let message = requestvalidator.Validation(req.body, validatePost);
    if (message) {
        return next(new RequestError(400, message));
    }
    let NewPost = new Post({
        CreatorId: req.user.id,
        Title: req.body.Title,
        PostContent: req.body.PostContent,
        DateOfCreation: new Date()
    });
    NewPost.save((err) => {
        if (err) {
            console.log(err);
            return next(new RequestError(400, 'For some reason cannot save to database'));
        }
        res.status(200);
        res.send('Post successfully saved');
    });
});

router.put('/', authenticate, authorize, (req, res, next) => {
    let message = requestvalidator.Validation(req.body, validatePut);
    if (message) {
        return next(new RequestError(400, message));
    }
    let Change = {};
    for (let it in req.body) {
        if (it !== 'apiKey') {
            Change[it] = req.body[it]
        }
    }
    Post.findOneAndUpdate(req.user.id, Change,
        function (err) {
            if (err) {
                return next(new RequestError(400, err));
            }
            console.log('posts upd');
            res.status(200);
            res.send('complete');
        });
});

router.get('/', authenticate, (req, res, next) => {
    let tempurl = String(req.baseUrl.match(/[^\/]+$/));
    Post.find({ CreatorId: tempurl },
        function (err, posts) {
            result = {};
            if (err) {
                return next(new RequestError(400, err))
            } else {
                console.log('ok');
                res.status(200);
                res.send(posts);
            }
        });
});

router.delete('/', authenticate, authorize, (req, res, next) => {
    
});

module.exports = router;