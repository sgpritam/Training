const express = require("express");
const router = express.Router();
const passport = require("passport");

// @desc Auth with Google
// @route Get /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc Google auth Callback
// @route Get /auth/google/callback

router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		res.redirect("/dashboard");
	}
);

// @desc Auth with Google
// @route Get /auth/google
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;
