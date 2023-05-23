import Joi from "joi";

export function validateProducts(_reqBody) {
  let joiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.array().items(Joi.string().required()),
    price: Joi.number().required(),
    ingredients: Joi.array().items(Joi.string()),
    nutritionals: Joi.array().items(Joi.string()),
    categoryName: Joi.string().required(),
    restaurantRef: Joi.string().required(),
  });

  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
