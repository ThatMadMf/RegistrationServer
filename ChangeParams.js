var url = require('url');
const User = require('./DbFiles/Schema');
const RequestError = require('./RequestError');
const requestvalidator = require('./RequestValidation/Validator');

function ChangeParams(req, res, next) {
    let message = requestvalidator.validChange(req.body);
    if (message) {
        console.log('error found')
        req.ReqErr = new RequestError(400, message);
        next();
    }
    let curretnid = req.params.userId;
    User.findOne({ id: curretnid },
        function (err, founduser) {
            if (err) {
                req.ReqErr = new RequestError(400, err);
                next();
            }
            if (founduser === null) {
                req.ReqErr = new RequestError(400, 'User is not found');
                next();
            }
            if (founduser.id !== req.user.id) {
                req.ReqErr = new RequestError(403, 'Authorization Error');
                next();
            }
            User.findOneAndUpdate(founduser.apiKey, req.body,
                function (err) {
                    if (err) {
                        console.log('nope');
                        next();
                    }
                    else {
                        console.log('yep');
                        next();
                    }
                });
        });
}

module.exports = ChangeParams;