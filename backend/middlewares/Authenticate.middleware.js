const jwt = require('jsonwebtoken')


const Authenticate = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" })
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.message === 'jwt expired') {
                    return res.status(401).send({ error: "Token expired" })
                }
                return res.status(400).send({ error: "Something went wrong" })
            }
            if (decoded) {
                req.userId = decoded._id;
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