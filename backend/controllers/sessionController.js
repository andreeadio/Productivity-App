const { db } = require('../db-config/firebaseConfig');

const SESSION_TYPES = ["focus", "break"];

const createSession = async (req, res) => {
    try {
        console.log("Received request to create session:", req.body);
        const { type, duration, timestamp } = req.body;
        const userId = req.user.uid;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized - User must be logged in" });
        }

        if (!type || !SESSION_TYPES.includes(type)) {
            return res.status(400).json({ error: "Invalid session type. Allowed values: 'focus', 'break'" });
        }
        if (!duration || typeof duration !== "number" || duration <= 0) {
            return res.status(400).json({ error: "Invalid duration. Must be a positive number (in minutes)" });
        }
        if (!timestamp || isNaN(Date.parse(timestamp))) {
            return res.status(400).json({ error: "Invalid timestamp format" });
        }

        const newSession = { type, duration, timestamp: new Date(timestamp).toISOString(), userId };
        const docRef = await db.collection("sessions").add(newSession);

        res.status(201).json({ id: docRef.id, ...newSession });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "An error occurred while creating the session" });
    }
};

const getSessions = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Unauthorized - No valid user ID" });
        }

        const userId = req.user.uid;
        const snapshot = await db.collection("sessions").where("userId", "==", userId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No sessions found for this user" });
        }

        const sessions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(sessions);
    } catch (error) {
        console.error(" Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

module.exports = { getSessions, createSession };
