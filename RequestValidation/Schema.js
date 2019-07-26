const Schema = {
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

const Request = {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
        email: {type: 'string', format: 'email'},
        password: {type: 'string'},
        required: true
    }
}

const Change = {
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

const Post = {
    type : 'object',
    additionalProperties: false,
    required: ['Title', 'PostContent', 'apiKey'],
    properties: {
        Title: {type: 'string'},
        PostContent: {type: 'string'},
        apiKey: {type: 'string'}
    }
}

const Put = {
    type: 'object',
    additionalProperties: false,
    required: ['apiKey'],
    properties: {
        Title: {type: 'string'},
        PostContent: {type: 'string'},
        apiKey: {type: 'string'}
    }
}
module.exports = {Change, Request, Schema, Post, Put};