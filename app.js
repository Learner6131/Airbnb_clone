if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

mongoose.set("strictQuery", true);

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Databace connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 10000,
    maxAge: 7 * 24 * 60 * 60 * 10000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE TO ACCESS THE flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.loggedUser = req.user;
  next();
});

// app.get("/getuser", async (req, res) => {
//   let fakeUser = new User({
//     email: "delta-student-123@gmail.com",
//     username: "delta1",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld"); //automatically checks if username if unique or not and also saves and returns a promis of new saved user
//   res.send(registeredUser);
// });

//LISTINGS Route
app.use("/listings", listingsRouter);
//REVIEW route
app.use("/listings/:id/reviews", reviewsRouter);
//USER Router
app.use("/", userRouter);

// Saving sample data
// app.get("/Listing", async (req, res) => {
//      let sampleListing = new Listing({
//       title: "My new Villa ",
//        description: "By the beach",
//       price: 12000,
//        location: "Goa",
//        country: "India",
//    });

//     await sampleListing.save();
//   console.log("saved");
//   res.send(sampleListing);
// });

//for all other paths than ours

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  console.log(err);
  res.render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is started");
});
