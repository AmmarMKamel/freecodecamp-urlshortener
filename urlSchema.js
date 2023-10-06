// Import mongoose module
const mongoose = require("mongoose");

// Assign mongoose.Schema to Schema variable
const Schema = mongoose.Schema;

// Define URL schema with mongoose Schema
const urlSchema = new Schema({
	// The schema requires a type and a "required" option for url
	url: { type: String, required: true },

	// The schema requires a type and a "required" option for shortUrl
	shortUrl: { type: Number, required: true },
});

// Export default mongoose model of URL schema
export default mongoose.model("Url", urlSchema);
