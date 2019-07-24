const Ajv = require('ajv');
const ajv = Ajv();
const Schema = require('./Schema.js');
const validateRegistration = ajv.compile(Schema.Schema);
const validateLogin = ajv.compile(Schema.Request);

exports.validReg = function (data) {
    let boolres = validateRegistration(data);
    let result = '';
    if(!boolres) {
        for(let item in validateRegistration.errors) {
            result += validateRegistration.errors[item].message + '\n';
        }
        return result;
    }
}

exports.validLog = function(data) {
    let boolres = validateLogin(data);
    let result = '';
    if(!boolres) {
        for(let item in validateLogin.errors) {
            result += validateLogin.errors[item].message + '\n';
        }
        return result;
    }
}


module.exports.module;