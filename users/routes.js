const express = require('express')
const router = express.Router()
const validateChange = require('./validation').changereq
const authenticate = require('../authenticate')
const authorize = require('../authorize')
const User = require('./schema')
const RequestError = require('../errors/RequestError')
const requserValidator = require('../Validator')
const toJson = require('./services').toJson

router.put('/:userId', authenticate, authorize, (req, res, next) => { // if user passed authentication & authorization - commit given changes
  const message = requserValidator.Validation(req.body, validateChange)
  if (message) {
    console.log('error found')
    return next(new RequestError(400, message))
  }
  User.findOneAndUpdate({ id: req.user.id }, req.body)
    .then(() => {
      res.status(200)
      res.send('upd')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.delete('/:userId', authenticate, authorize, (req, res, next) => {
  User.findOneAndDelete({ id: req.user.id })
    .then(() => {
      res.status(200)
      res.send('deleted')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.get('/:userId', authenticate, (req, res, next) => {
  User.findOne({ id: req.params.userId })
    .then(user => {
      res.status(200).send(toJson(user))
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

module.exports = router
