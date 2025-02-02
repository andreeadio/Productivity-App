const auth = require("../db-config/firebaseConfig")

const admin = require("firebase-admin");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No token provided");
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const token = authHeader.split("Bearer ")[1];
        console.log("Received Token:", token);

        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Decoded Token:", decodedToken);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(403).json({ error: "Forbidden - Invalid or expired token" });
    }
};

module.exports = authenticate;


