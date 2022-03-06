const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid1')
    }

    const token = authorizationHeader.slice(7)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.id,
            usernmame: payload.username,
        }
        next();
    }catch(err) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = authMiddleware;