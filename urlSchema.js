// Import mongoose and mongoose-auto-increment module
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// Initialize mongoose-auto-increment
autoIncrement.initialize(mongoose.connection);

// Assign mongoose.Schema to Schema variable
const Schema = mongoose.Schema;

// Define URL schema with mongoose Schema
const urlSchema = new Schema({
	// The schema requires a type and a "required" option for url
	url: { type: String, required: true, unique: true },
});

// Apply the AutoIncrement plugin to urlSchema and specify the field to auto increment
urlSchema.plugin(autoIncrement.plugin, { model: "Url", field: "id" });

// Export default mongoose model of URL schema
module.exports = mongoose.model("Url", urlSchema);
