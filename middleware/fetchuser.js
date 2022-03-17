const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const fetchuser = (req, res, next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, SECRET_KEY);
        req.user = data;
        next();
    } catch (err) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchuser;