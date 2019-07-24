var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    id : {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
