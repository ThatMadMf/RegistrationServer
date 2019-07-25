// exports.Schema = {
//     type: 'object',
//     additionalProperties: false,
//     required: ['name', 'email', 'password', 'confirmPassword'],
//     items: { 
//         name: {type: 'string'}, 
//         email: {type: 'email'}, 
//         address: {type: 'string'}, 
//         password: {type: 'string'},
//         confirmPassword: {type: 'string'}
//     }
// }
exports.Schema = {
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
}

exports.Request = {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
        email: {type: 'string', format: 'email'},
        password: {type: 'string'},
        required: true
    }
}

exports.Change = {
    type: 'object',
    additionalProperties: false,
    required: ['apiKey'],
    properties: {
        email: {type: 'string', format: 'email'},
        name: {type: 'string'},
        address: {type: 'string'},
        apiKey: {type : 'string'}
    }
}
module.exports.module;