const express = require('express')
const authenticate = require('../authenticate')
const authorize = require('../posts/middleware')
const uuidv4 = require('uuid/v4')
const requestvalidator = require('../Validator')
const validatePost = require('./validation').post
const validatePut = require('./validation').put
const Post = require('./schema')
const RequestError = require('../errors/RequestError')
const router = express.Router()
const comment = require('../comments/routes')
const toJson = require('./services').postSevricetoJson

// This router will give response for post, get, put and delete request by given postId.
// For sake of security user must pass authentication to create a new post and athourization to change existing post

router.post('/', authenticate, (req, res, next) => {
  const message = requestvalidator.validation(req.body, validatePost)
  if (message) {
    return next(new RequestError(400, message))
  }
  const NewPost = new Post({
    userId: req.user.id,
    postId: uuidv4(),
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  })
  NewPost.save()
    .then(() => {
      res.status(200)
      res.send('Post successfully saved')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.put('/:postId', authenticate, authorize, (req, res, next) => {
  const message = requestvalidator.validation(req.body, validatePut)
  if (message) {
    return next(new RequestError(400, message))
  }
  const Change = {}
  for (const it in req.body) {
    Change[it] = req.body[it]
  }
  Post.findOneAndUpdate({ postId: req.params.postId }, Change)
    .then(() => {
      res.status(200)
      res.send('complete')
    })
    .catch(err => {
      return next(new RequestError(400, err))
    })
})

router.get('/:postId', authenticate, (req, res, next) => {
  Post.findOne({ postId: req.params.postId })
    .then((post) => {
      res.status(200)
      res.send(toJson(post))
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
})

router.delete('/:postId', authenticate, authorize, (req, res, next) => {
  Post.findOneAndDelete({ postId: req.params.postId })
    .then(() => {
      res.status(200)
      res.send('deleted')
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
})

router.post('/:postId/like', authenticate, (req, res, next) => {
  Post.findOne({ postId: req.params.postId })
    .then((post) => {
      if (post.likedBy.indexOf(req.user.id) === -1) {
        Post.update({ postId: req.params.postId },
          { $push: { likedBy: req.user.id } })
          .then(() => {
            res.status(200).send('liked')
          })
          .catch((err) => {
            return next(new RequestError(400, err))
          })
      } else {
        Post.update({ postId: req.params.postId },
          { $pull: { likedBy: req.user.id } })
          .then(() => {
            res.status(200).send('like removed')
          })
          .catch((err) => {
            return next(new RequestError(400, err))
          })
      }
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
})

router.get('/:postId/likes', authenticate, (req, res, next) => {
  Post.findOne({ postId: req.params.postId })
    .then((post) => {
      res.status(200).send(post.likedBy)
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
})

router.use('/:postId/comments', addPostId, comment)

function addPostId (req, res, next) {
  Post.findOne({ postId: req.params.postId })
    .then(post => {
      req.postId = req.params.postId
      next()
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
}

module.exports = router
