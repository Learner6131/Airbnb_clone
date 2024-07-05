const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./validation.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in first!");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(res.locals.loggedUser);
  if (!listing.owner._id.equals(res.locals.loggedUser._id)) {
    req.flash("error", "You don't have access to this account");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateLiisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // using the Joi validator that we created
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // using the Joi validator that we created
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author._id.equals(res.locals.loggedUser._id)) {
    req.flash("error", "You are not the Author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
