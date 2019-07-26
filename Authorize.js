const url = require('url');
const Ajv = require('ajv')
const ajv = Ajv();
const User = require('./DbFiles/UserSchema');
const RequestError = require('./RequestError');
const requestvalidator = require('./RequestValidation/Validator');

function Authorize(req, res, next) {
    let tempurl = String(req.baseUrl.match(/[^\/]+$/));
    if (req.user.id !== req.params.userId && req.user.id !== tempurl) {
        return next(new RequestError(403, 'Authorization Error'));
    }
    console.log('authorize');
    next();
}


module.exports = Authorize;