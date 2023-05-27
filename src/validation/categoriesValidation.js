import Joi from "joi";

export function validateCategories(reqBody) {
  const schema = Joi.object({
    categoryName: Joi.string().min(2).max(150).required(),
    itemsId: Joi.array(),
  });

  return schema.validate(reqBody);
}
