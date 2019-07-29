const express = require('express');
const router = express.Router();
const validateChange = require('./validation').changereq;
const authenticate = require('../authenticate');
const authorize = require('../authorize');
const User = require('./schema');
const RequestError = require('../errors/RequestError');

// router.param('users', function (req, res, next, userId) {
//     User.findOne({ userId: userId },
//         function (err, founduser) {
//             if (err) {
//                 console.log('err');
//                 return next(new RequestError(400, err));
//             }
//             if (founduser === null) {
//                 console.log('User is not logged');
//                 return next(new RequestError(400, 'User is not found'));
//             }
//             req.user = founduser;
//             console.log('authenticate');
//             next();
//         });
// });

router.put('/:userId', authenticate, authorize, (req, res, next) => {
    
    let message = requestvalidator.Validation(req.body, validateChange);
    if (message) {
        console.log('error found')
        return next(new RequestError(400, message));
    }
    User.findOneAndUpdate(req.user.apiKey, req.body,
        function (err) {
            if (err) {
                return next(new RequestError(400, err));
            }
            else {
                console.log('user upd');
                res.status(200);
                res.send('complete');
            }
        });
});

router.delete('/:userId', authenticate, authorize, (req, res, next) => {
    User.findOneAndDelete(req.user.apiKey,
        function (err) {
            if (err) {
                return next(new RequestError(400, err));
            }
            else {
                console.log('deleted');
                res.status(200);
                res.send('deleted');
            }
        });
});

router.get('/:userId', authenticate, (req, res, next) => {
    User.findOne({ id: req.params.userId },
        function (err, user) {
            if (err) {
                return next(new RequestError(400, err));
            }
            else {
                console.log(req.user);
                res.status(200);
                res.send({
                    id: user.id, name: user.name, email: user.email,
                    address: user.address
                });
            }
        });
});

module.exports = router;
