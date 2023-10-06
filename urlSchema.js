// Import mongoose and mongoose-sequence module
const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);

// Assign mongoose.Schema to Schema variable
const Schema = mongoose.Schema;

// Define URL schema with mongoose Schema
const urlSchema = new Schema({
	// The schema requires a type and a "required" option for url
	url: { type: String, required: true },
});

// Apply the AutoIncrement plugin to urlSchema and specify the field to auto increment
urlSchema.plugin(AutoIncrement, { inc_field: "_id" });

// Export default mongoose model of URL schema
module.exports = mongoose.model("Url", urlSchema);
