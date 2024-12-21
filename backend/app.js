const cors = require("cors")
const express = require('express')
const app = express()
app.use(cors())



app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.status(200);
    res.send('Hello World!')
});

port = 3030
app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
)
