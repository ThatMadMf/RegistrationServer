const express = require('express')
const authenticate = require('../authenticate')
const uuidv4 = require('uuid/v4')
const authorize = require('./middleware')
const requestvalidator = require('../Validator').validation
const validate = require('./validation')
const Comment = require('./schema')
const RequestError = require('../errors/RequestError')
const router = express.Router()

router.post('/', authenticate, (req, res, next) => {
  const message = requestvalidator(req.body, validate)
  if (message) {
    return next(new RequestError(400, message))
  }
  const newComment = new Comment({
    userId: req.user.id,
    postId: req.postId,
    id: uuidv4(),
    content: req.body.content,
    createdAt: new Date()
  })
  newComment.save()
    .then(() => {
      res.status(200)
      res.send('Comment successfully saved')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.put('/:commentId', authenticate, authorize, (req, res, next) => {
  const message = requestvalidator(req.body, validate)
  if (message) {
    return next(new RequestError(400, message))
  }
  const Change = {}
  for (let it in req.body) {
    Change[it] = req.body[it]
  }
  Comment.findOneAndUpdate({ id: req.params.commentId }, Change)
    .then(() => {
      res.status(200)
      res.send('complete')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.get('/:commentId', authenticate, (req, res, next) => {
  Comment.findOne({ id: req.params.commentId })
    .then((comment) => {
      res.status(200)
      res.send(comment)
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.delete('/:commentId', authenticate, authorize, (req, res, next) => {
  Comment.findOneAndDelete({ id: req.params.commentId })
    .then(() => {
      res.status(200).send('deleted')
    })
    .catch((err) => {
      console.log('err')
      return next(new RequestError(400, err))
    })
})

module.exports = router
