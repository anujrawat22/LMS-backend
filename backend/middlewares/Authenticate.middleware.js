const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY


const Authenticate = (req, res, next) => {

    const token = req.headers?.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" })
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(400).send({ error: "Something went wrong" })
            }
            if (decoded) {
                req.userId = decoded.id;
                req.role = decoded.role;
                next()
            } else {
                return res.status(400).send({ error: "Something went wrong" })
            }
        })
    } catch (error) {
        console.log("Authentication error :", error)
        res.status(500).send({ error: "Server error" })
    }
}

module.exports = { Authenticate }