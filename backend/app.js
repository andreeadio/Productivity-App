require('dotenv').config()

const db = require("./db-config/firebaseConfig");

const cors = require("cors")
const bodyParser = require('body-parser');

const express = require('express')
const app = express()
app.use(cors())
app.use(bodyParser.json());


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.status(200);
    res.send('Hello World!')
});

app.post("/tasks", async (req, res) => {
    try {
        const data = req.body; // Obiect de tip { title: "Task title", description: "Task description" }
        const taskRef = await db.collection("tasks").add(data);
        res.status(201).send({ message: "Task created", id: taskRef.id });
    } catch (error) {
        console.error("Error saving task:", error);
        res.status(500).send({ error: "Failed to save task" });
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const snapshot = await db.collection("tasks").get();
        const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Failed to fetch tasks" });
    }
});

const port = process.env.PORT
app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
)
