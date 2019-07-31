const User = require('./users/schema')
const RequestError = require('./errors/RequestError')

function authenticate (req, res, next) { // searching user by given apiKey
  console.log(req.params)
  const params = req.headers['x-api-key']
  User.findOne({ apiKey: params },
    function (err, founduser) {
      if (err) {
        console.log('err')
        return next(new RequestError(400, err))
      }
      if (founduser === null) {
        console.log('User is not logged')
        return next(new RequestError(401, 'User is not logged'))
      }
      req.user = founduser
      console.log('authenticate')
      next()
    })
};

module.exports = authenticate
