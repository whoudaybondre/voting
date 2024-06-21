const jwt = require('jsonwebtoken');

const jwtAuthMidlleware = (req, res, next) => {
    //first check the request header has authorization or not
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: 'Token not found' });
    }


    //extract the jwt toen from req header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        //verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid Token' });
    }
}

//function to genrate token

const generateToken = (userData) => {
    //generate new jwt token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 300000 });

}

module.exports = { jwtAuthMidlleware, generateToken }