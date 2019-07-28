const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    CreatorId: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        unique: true,
        required: true
    },
    PostContent: {
        type: String,
        required: true
    },
    DateOfCreation: {
        type: Date,
        required: true
    }
});

var UserPost = mongoose.model('Post', PostSchema);
module.exports = UserPost;
