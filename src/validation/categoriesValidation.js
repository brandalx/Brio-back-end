import Joi from "joi";
// Joi validator for created schema
export function validateCategories(_reqBody) {
  let joiSchema = Joi.object({
    categoryName: Joi.string().min(2).max(150).required(),
    itemsId: Joi.array().required(),
  });

  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
