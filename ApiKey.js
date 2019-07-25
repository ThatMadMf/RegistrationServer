var url = require('url');
const User = require('./DbFiles/Schema');
const RequestError = require('./RequestError');

function Authenticate(req, res, next) {
    var params = req.body.apiKey;
    User.findOne({ apiKey: params },
        function (err, founduser) {
            if (err) {
                req.ReqErr = new RequestError(400, err);
                console.log('err')
                next();
            }
            if (founduser === null) {
                req.ReqErr = new RequestError(401, 'User is not logged');
                console.log('User is not logged');
                next();
            } 
            req.user = founduser;
            console.log('authenticate');
            next();
            
        });
};

module.exports = Authenticate;