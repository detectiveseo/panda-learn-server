const jwt = require('jsonwebtoken');
module.exports = verifyJwt = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send("unautorization access")
    }
    const fromClintSideToken = authorization.split(" ")[1]
    jwt.verify(fromClintSideToken, process.env.TOKEYN_KEY, (err, decoded) => {
        if(err){
            return res.status(401).send("unautorization access")
        }
        req.decoded = decoded; 
        next();
    })

}