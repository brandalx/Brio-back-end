import Joi from "joi";

// Joi validator for created schema
export function validateRestaurantClient(_reqBody) {
  let joiSchema = Joi.object({
    title: Joi.string().min(2).max(150).required(),
    address: Joi.string().min(2).max(150).required(),
    location: Joi.string().min(2).max(150).required(),
    image: Joi.string().min(1).max(150).allow(null, ""),
    reviews: Joi.object(),
    tags: Joi.object(),
    description: Joi.string(),
    email: Joi.string(),
    minprice: Joi.number().integer().positive(),
    time: Joi.string(),
    company: Joi.string().min(1).max(150).required(),
    products: Joi.array().items(Joi.string()).unique(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateRestaurantComment(_reqBody) {
  const joiSchema = Joi.object({
    commentRef: Joi.string().min(3).max(150).required(),
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(0).max(450).allow(null, " "),
  }).required();

  return joiSchema.validate(_reqBody);
}

export function validateRestaurantLike(_reqBody) {
  const joiSchema = Joi.object({
    commentId: Joi.string().min(3).max(150).required(),
    restaurantId: Joi.string().min(3).max(150).required(),
  }).required();

  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
