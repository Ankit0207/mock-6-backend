const jwt = require("jsonwebtoken");
require("dotenv").config();



const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SecretKey);
            if (decoded) {
                req.userId = decoded.userId;
                req.userName = decoded.userName;
                next();
            } else {
                return res.status(400).json({ msg: "user not authorized" })
            }
        } catch (err) {
            return res.status(400).json({ error: err.message })
        }
    } else {
        return res.status(400).json({ msg: "login to continue" })
    }
}


module.exports = { authMiddleware };