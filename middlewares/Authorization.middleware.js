

const Authorize = (roles) => {
    return (req, res, next) => {
        if (req.userId && roles.includes(req.role)) {
            next()
        } else {
            return res.status(403).send({ error: "Forbidden" })
        }
    }
}

module.exports = { Authorize }