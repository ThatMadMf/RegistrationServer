const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
})

var UserPost = mongoose.model('Post', PostSchema)
module.exports = UserPost
