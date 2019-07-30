const Ajv = require('ajv');
const ajv = Ajv();

const schema = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: ['content'],
    properties: {
        content: { type: 'string' }
    }
});

module.exports = schema;