const Ajv = require('ajv')
const ajv = Ajv()

const post = ajv.compile({
  type: 'object',
  additionalProperties: false,
  required: ['title', 'content'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' }
  }
})

const put = ajv.compile({
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    content: { type: 'string' }
  }
})

module.exports = { post, put }
