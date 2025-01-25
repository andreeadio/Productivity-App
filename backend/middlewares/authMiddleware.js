const auth = require("../db-config/firebaseConfig")

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authrization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized - No token provided" })
    }

    const token = authHeader.split(" ")[1]
    try {
        const decodedToken = await auth.verifyIdToken(token)

        console.log(decodedToken)
        req.user = decodedToken
        next()
    } catch (error) {
        res.status(403).json({ error: "Forbidden - Invalid token" })
    }
}

module.exports = authenticate