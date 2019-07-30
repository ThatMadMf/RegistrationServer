const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    id: {
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

});

const commentSchema = mongoose.model('commmet', comment);
module.exports = commentSchema;