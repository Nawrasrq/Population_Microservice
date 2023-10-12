const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5555;
const HOST = process.env.PORT || "http://localhost:5555/";


// Setup app
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname, + "index.html"));
app.use(express.json());

const api = require("./routes/api.js");
app.use("/api", api);

// GET request initial page
app.get('/', (req, res) => {
    res.sendFile(__dirname, + "index.html");
});

app.listen(PORT, () => {
    console.log(`Population microservice listening on port ${PORT} at ${HOST}`);
});