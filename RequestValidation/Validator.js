const Ajv = require('ajv');
const ajv = Ajv();
const Schema = require('./Schema.js');

exports.Validation = function (data, validator) {
    let boolres = validator(data);
    let result = '';
    if(!boolres) {
        for(let item in validator.errors) {
            result += validator.errors[item].message + '\n';
        }
        return result;
    }
}

module.exports.module;