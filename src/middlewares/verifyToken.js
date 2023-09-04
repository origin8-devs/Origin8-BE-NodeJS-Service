const { verifyJWT } = require("../libraries");

const verifyToken = async (req, res, next, options = {}) => {
   
    let User = verifyJWT(req.headers.authorization);
    Object.assign(
        req.headers,
        {
            User,
        }
    );
    next()

};

module.exports = verifyToken