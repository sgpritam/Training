const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	categories: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "public",
		enum: ["public", "private"],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	CreatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Blog", BlogSchema);
