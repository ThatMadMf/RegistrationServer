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

// This router will give response for post, get, put and delete request by given postId.
// For sake of security user must pass authentication to create a new post and athourization to change existing post


router.post('/', authenticate, (req, res, next) => {
  const message = requestvalidator.Validation(req.body, validatePost)
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
  NewPost.save((err) => {
    if (err) {
      console.log(err)
      return next(new RequestError(400, 'For some reason cannot save to database'))
    }
    res.status(200)
    res.send('Post successfully saved')
  })
})

router.put('/:postId', authenticate, authorize, (req, res, next) => {
  const message = requestvalidator.Validation(req.body, validatePut)
  if (message) {
    return next(new RequestError(400, message))
  }
  const Change = {}
  for (const it in req.body) {
    Change[it] = req.body[it]
  }
  Post.findOneAndUpdate({ postId: req.params.postId }, Change,
    function (err) {
      if (err) {
        return next(new RequestError(400, err))
      }
      console.log('posts upd')
      res.status(200)
      res.send('complete')
    })
})

router.get('/:postId', authenticate, (req, res, next) => {
  Post.findOne({ postId: req.params.postId },
    function (err, post) {
      if (err) {
        return next(new RequestError(400, err))
      } else {
        console.log(post)
        res.status(200)
        res.send(post)
      }
    })
})

router.delete('/:postId', authenticate, authorize, (req, res, next) => {
  Post.findOneAndDelete({ postId: req.params.postId },
    function (err, findres) {
      if (err) {
        return next(new RequestError(400, err))
      }
      if (findres === null) {
        return next(new RequestError(400, 'Cannot find the post'))
      } else {
        console.log('deleted')
        res.status(200)
        res.send('deleted')
      }
    })
})

router.use('/:postId/comments',addPostId, comment)

function addPostId(req, res, next) {
  Post.findOne({postId: req.params.postId},
    function(err, findres) {
      if(err) {
        return next (new RequestError(400, err))
      }
      if(findres === null) {
        return next(new RequestError(400, 'Cannot find the post'))
      }
      req.postId = req.params.postId;
      next();
    })
}

module.exports = router
