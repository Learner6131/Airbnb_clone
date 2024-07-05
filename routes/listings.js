const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, validateLiisting } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateLiisting,
    wrapAsync(listingControllers.createNewListing)
  );

//Get a form for Create new
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

// edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateLiisting,
  wrapAsync(listingControllers.renderEditForm)
);

//show all listings
//router.get("/", wrapAsync(listingControllers.index));

//Create Route
// router.post(
//   "/",
//   isLoggedIn,
//   validateLiisting,
//   wrapAsync(listingControllers.createNewListing)
// );

// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingControllers.updateListing)
// );

//show single listing
//router.get("/:id", wrapAsync(listingControllers.showListing));

//Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingControllers.destroyListing)
// );

module.exports = router;
