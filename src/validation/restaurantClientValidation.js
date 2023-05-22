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
    minprice: Joi.number().integer().positive(),
    time: Joi.string(),
    company: Joi.string().min(1).max(150).required(),
    products: Joi.array().items(Joi.string()).unique(),
  });

  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)