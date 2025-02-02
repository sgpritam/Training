const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const connectDB = require("./config/db");

//load config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

// Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Handlebars helper
const {
	formatDate,
	stripTags,
	truncate,
	editIcon,
	select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
	".hbs",
	exphbs({
		helpers: {
			formatDate,
			stripTags,
			truncate,
			editIcon,
			select,
		},
		defaultLayout: "main",
		extname: "hbs",
	})
);
app.set("view engine", ".hbs");

//Sessions
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		// store: new MongoStore({ mongooseConnection: mongoose.connection }), // new find
		store: new MongoStore({
			uri: process.env.MONGO_URI,
			collection: "mysession",
		}),
	})
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global var
app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/blogs", require("./routes/blogs"));

const PORT = process.env.PORT || 3000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
