const express = require("express")
const router = express.Router()
const { getTasks, createTask, updateTask, deleteTask, getTasksByStatus } = require("../controllers/taskController")

router.get('/', getTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.get('/:status', getTasksByStatus)


module.exports = router
