const jwt = require('jsonwebtoken');
require('dotenv').config();

const isUserLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Not authorized');

    const type = authHeader.split(" ")[0];
    const value = authHeader.split(" ")[1];

    if (type.toLowerCase() == 'bearer') {
        const decoded = jwt.verify(value, process.env.secret);
        req.userInfo = decoded;
        return next();
    }
}


module.exports = isUserLoggedIn;