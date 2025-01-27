const express = require("express")
const router = express.Router()
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController"

router.get('/', getTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)


module.exports = router
