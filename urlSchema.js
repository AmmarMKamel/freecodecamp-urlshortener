// Import mongoose module
const mongoose = require("mongoose");

// Assign mongoose.Schema to Schema variable
const Schema = mongoose.Schema;

// Define URL schema with mongoose Schema
const urlSchema = new Schema({
	// The schema requires a type and a "required" option for url
	id: { type: Number, default: 0, unique: true },
	url: { type: String, required: true, unique: true },
});

urlSchema.pre("save", function (next) {
	// Auto-increment id field before each save
	const Model = this;
	mongoose
		.model("Url", urlSchema)
		.find({})
		.sort({ id: -1 })
		.limit(1)
		.then(function (topRecord) {
			if (topRecord.length == 0) {
				Model.id = 1;
			} else {
				Model.id = topRecord[0].id + 1;
			}
			next();
		})
		.catch(function (error) {
			throw new Error(error);
		});
});

// Export default mongoose model of URL schema
module.exports = mongoose.model("Url", urlSchema);
