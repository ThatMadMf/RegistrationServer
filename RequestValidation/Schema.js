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
module.exports.module;