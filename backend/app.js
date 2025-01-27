require('dotenv').config()
const db = require("./db-config/firebaseConfig");
const cors = require("cors")
const bodyParser = require('body-parser');
const express = require('express');
const authenticate = require('./middlewares/authMiddleware');

taskRouter = require('./routes/taskRouter')


const app = express()

app.use(cors())
app.use(bodyParser.json());

app.use(authenticate)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.status(200);
    res.send('Hello World!')
});

//routes
app.use('/api/tasks', authenticate, taskRouter);


const port = process.env.PORT
app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
)
