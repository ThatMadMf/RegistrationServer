const Ajv = require('ajv');
const ajv = Ajv();


const signupreq = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: ['name', 'email', 'password', 'confirmPassword'],
    properties: { 
        name: {type: 'string'}, 
        email: {type: 'string', format: 'email'}, 
        address: {type: 'string'}, 
        password: {type: 'string'},
        confirmPassword: {type: 'string'},
        required: true
    }
});

const loginreq = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
        email: {type: 'string', format: 'email'},
        password: {type: 'string'},
        required: true
    }
});

const changereq = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: ['apiKey'],
    properties: {
        email: {type: 'string', format: 'email'},
        name: {type: 'string'},
        address: {type: 'string'},
        apiKey: {type : 'string'}
    }
});

module.exports = {signupreq, loginreq, changereq};