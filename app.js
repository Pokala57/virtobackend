const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const registerRoute = require('./src/controller/register');
const port = 4111;

app.use(cors({ origin: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.get("/", async (req, res) => {
    res.send("Welcome to Culinary Onboard accessed...");
});

app.use("/", registerRoute);




mongoose.connect("mongodb+srv://dbUser:J4MVCsNIjnQhiRkl@cluster0.luvadrg.mongodb.net/?retryWrites=true&w=majority");

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

