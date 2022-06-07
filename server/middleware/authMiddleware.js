const jwt = require("jsonwebtoken");
const {secret} = require("../config");

module.exports = function (req, res, next) {
    console.log(req.headers);
    if (req.method === "OPTIONS") {
        next();
    }

    // console.log(req.headers.authorization);

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Войдите в учетную запись" })
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        // console.log(req.user);
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: "Войдите в учетную запись" })
    }
}