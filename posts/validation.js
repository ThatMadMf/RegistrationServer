const Ajv = require('ajv');
const ajv = Ajv();

const post = ajv.compile({
    type : 'object',
    additionalProperties: false,
    required: ['title', 'content', 'apiKey'],
    properties: {
        title: {type: 'string'},
        content: {type: 'string'},
        apiKey: {type: 'string'}
    }
});

const put = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: ['apiKey'],
    properties: {
        title: {type: 'string'},
        content: {type: 'string'},
        apiKey: {type: 'string'}
    }
});

module.exports = {post, put};