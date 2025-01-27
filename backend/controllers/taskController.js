const db = require('../db-config/firebaseConfig')

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done', 'Aborted'];

//get tasks per user
const getTasks = async (req, res) => {

    try {
        const userId = req.user.uid;
        const snapshot = await db.collection('tasks').where('userId', '==', userId).get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (tasks.length > 0)
            res.status(200).json(tasks);
        else
            res.status(200).json({ message: `User ${userId} has no tasks` })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
}

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, status } = req.body;
        const userId = req.user.uid;

        if (!title) {
            return res.status(400).json({ error: "Title field is required" })
        }
        if (!dueDate) {
            return res.status(400).json({ error: "Due Date field is required" })
        }
        if (!STATUS_OPTIONS.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" })
        }
        const newTask = { title, description, priority, dueDate, status: STATUS_OPTIONS[0], userId }; //completed: false
        const docRef = await db.collection('tasks').add(newTask);
        res.status(201).json({ id: docRef.id, ...newTask });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the task' });
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, dueDate, status } = req.body;

        if (!title || !dueDate || !STATUS_OPTIONS.includes(status)) {
            return res.status(400).json({ error: 'Invalid data. Check title, due date, and status.' });
        }




        const taskRef = db.collection('tasks').doc(id);
        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await taskRef.update({ title, description, priority, dueDate, status });
        res.status(200).json({ id, title, description, priority, dueDate, status });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the task' });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const taskRef = db.collection('tasks').doc(id);
        const taskSnapshot = await taskRef.get();

        if (!taskSnapshot.exists) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await taskRef.delete();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
}

module.exports = { createTask, getTasks, updateTask, deleteTask }