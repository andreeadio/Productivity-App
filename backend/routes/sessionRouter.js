const express = require("express")
const router = express.Router()

const { getSessions, createSession } = require("../controllers/sessionController")

router.post("/", createSession);
router.get('/', getSessions)

module.exports = router