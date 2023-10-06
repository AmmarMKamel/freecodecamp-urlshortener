require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Define the MongoDB connection string
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oev1cbu.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

// Connect to MongoDB using Mongoose
mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Set connection options
	.then(() => console.log("Connected to MongoDB Atlas")) // Log success message on successful connection
	.catch((err) => console.error("Failed to connect to MongoDB Atlas:", err)); // Log error message on failed connection

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
