const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().max(30).required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().max(300),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});
