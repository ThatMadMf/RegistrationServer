const RequestError = require('./errors/RequestError')

function authorize (req, res, next) { // checking if apiKey of user that sent request is same with operated id
  if (req.user.id !== req.params.userId) {
    return next(new RequestError(403, 'Authorization Error'))
  }
  console.log('authorize')
  next()
}

module.exports = authorize
