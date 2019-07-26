const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/MyDb", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => {
    res.status(403);
    console.log('conndection error');
    console.error.bind(console, 'connection error:')
});
db.once('open', function () {
    console.log('we\'re connected!');
});


module.exports = db;
