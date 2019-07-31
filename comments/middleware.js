const RequestError = require('../errors/RequestError')
const comment = require('./schema')

function authorize (req, res, next) {
  comment.findOne({ id: req.params.commentId },
    (err, foundres) => {
      if (err) {
        return next(new RequestError(400, err))
      }
      if (foundres === null) {
        return next(new RequestError(400, 'Cannot find comment'))
      } else {
        if (foundres.userId !== req.user.id) {
          return next(new RequestError(400, 'users do not match'))
        }
        console.log('permission is given')
        next()
      }
    })
}

module.exports = authorize
