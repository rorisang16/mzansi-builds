//imports the express package
const express = require("express");

//creates an instance of the express application
const app = express();

//imports cors package to allow cross-origin requests
const cors = require("cors");

//Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get('/', (req, res) => {
    res.send('MzansiBuilds API is running');
});

// starts the server
const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});