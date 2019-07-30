const express = require('express');
const authenticate = require('../authenticate');
const authorize = require();
const uuidv4 = require('uuid/v4');
const requestvalidator = require('../Validator');
const validate = require('./validation');
const comment = require('./schema');
const RequestError = require('../errors/RequestError');
const router = express.Router();

router.post('/', authenticate), (req, res, next) => {
    let message = requestvalidator.Validation(req.body, validate);
    if (message) {
        return next(new RequestError(400, message));
    }
    let newComment = new comment({
        userId: req.user.id,
        postId: req.params.postId,
        id: uuidv4(),
        content: req.content,
        createdAd: new Date
    });
    newComment.save((err) => {
        if (err) {
            console.log(err);
            return next(new RequestError(400, 'For some reason cannot save to database'));
        }
        res.status(200);
        res.send('Comment successfully saved');
    });
}

