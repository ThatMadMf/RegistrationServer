let url = require('url');
const User = require('./DbFiles/Schema');
const RequestError = require('./RequestError');

function Authenticate(req, res, next) {
    let params = req.body.apiKey;
    User.findOne({ apiKey: params },
        function (err, founduser) {
            if (err) {
                console.log('err');
                return next(new RequestError(400, err));
            }
            if (founduser === null) {
                console.log('User is not logged');
                return next (new RequestError(401, 'User is not logged'));
            } 
            req.user = founduser;
            console.log('authenticate');
            next();
            
        });
};

module.exports = Authenticate;