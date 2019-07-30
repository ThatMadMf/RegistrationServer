const RequestError = require('./errors/RequestError');

function authorize(req, res, next) {  //checking if apiKey of user that sent request is same with operated id
    let tempurl = String(req.baseUrl.match(/[^\/]+$/));
    if (req.user.id !== req.params.userId && req.user.id !== tempurl) {
        return next(new RequestError(403, 'Authorization Error'));
    }
    console.log('authorize');
    next();
}

module.exports = authorize;