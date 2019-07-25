const url = require('url');
const Ajv = require('ajv')
const ajv = Ajv();
const User = require('./DbFiles/Schema');
const RequestError = require('./RequestError');
const requestvalidator = require('./RequestValidation/Validator');
const validateChange = ajv.compile(require('./RequestValidation/Schema').Change);

function ChangeParams(req, res, next) {
    let message = requestvalidator.Validation(req.body, validateChange);
    if (message) {
        console.log('error found')
        return next(new RequestError(400, message));
    }
    if (req.user.id !== req.params.userId) {
        return next(new RequestError(403, 'Authorization Error'));
    }
    next();
}


module.exports = ChangeParams;