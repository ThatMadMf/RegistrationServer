const Ajv = require('ajv');
const ajv = Ajv();
const Schema = require('./Schema.js');
const validate = ajv.compile(Schema.Schema);

exports.valid = function (data) {
    var boolres = validate(data)
    var result = '';
    if(!boolres) {
        for(var item in validate.errors) {
            result += validate.errors[item].message + '\n';
        }
        return result;
    }
}


module.exports.module;