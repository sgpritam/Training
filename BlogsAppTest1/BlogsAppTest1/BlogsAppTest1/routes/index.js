const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Blog = require("../models/Blog");

// @desc Login/landing page
// @route Get /
router.get("/", ensureGuest, (req, res) => {
	res.render("login", { layout: "login" });
});

// @desc Dashboard
// @route Get /Dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
	try {
		const blogs = await Blog.find({ user: req.user.id }).lean();
		res.render("dashboard", {
			name: req.user.firstName,
			blogs,
		});
	} catch (err) {
		console.log(err);
		res.render("error/500");
	}
});
module.exports = router;
