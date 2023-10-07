require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const app = express();

// Importing urlSchema as Url
const Url = require("./urlSchema");
const { doesNotMatch } = require("assert");

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

// Handle POST request to create the short URL
app.post("/api/shorturl", async (req, res) => {
	// Collect URL from request body
	const url = req.body.url;
	let hostname;

	// Try block to create new URL and fetch the hostname
	try {
		hostname = new URL(url).hostname;
	} catch (err) {
		// Log error message if the URL is invalid
		console.error("Invalid URL:", err);
		// Send response status 400 with error message
		return res.status(400).json({ error: "invalid url" });
	}

	// Promise to resolve the hostname
	const lookupResult = await new Promise((resolve, reject) => {
		// DNS lookup for hostname
		dns.lookup(hostname, (err, address, family) => {
			// Reject and throw error if any issue occurred during dns lookup
			if (err) {
				reject(err);
			} else {
				// Resolve if no error
				resolve({ address, family });
			}
		});
	});

	// Check if lookupResult exists
	if (lookupResult) {
		// Create new URL entry in the database
		const urlData = await Url.create({ url });
		// Send response status 201 with the original and short URL
		res.status(201).json({ original_url: url, short_url: urlData.id });
	} else {
		// Log error message if failed to resolve the hostname
		console.error("Failed to resolve hostname:", hostname);
		// Send response status 500 with error message
		res.status(500).json({ error: "Failed to resolve hostname" });
	}
});

// Setup express route for "shorturl" endpoint
app.get("/api/shorturl/:shorturl", async (req, res) => {
	// Parse the shorturl parameter and convert it to a number
	const id = Number(req.params.shorturl);

	// Use a try catch block to handle potential errors
	try {
		// Attempt to find a document in the Url collection with a matching id
		const document = await Url.findOne({ id });

		// If the document is found, redirect the client to the original url
		res.status(302).redirect(document.url);
	} catch (err) {
		// If an error occurs log the error message
		console.error("Failed to retrieve the document:", err);
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
