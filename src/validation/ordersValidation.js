import Joi from "joi";

export function validateOrder(order) {
  const schema = Joi.object({
    restaurantRef: Joi.string().required(),
    userRef: Joi.string().required(),
    products: Joi.array()
      .items(
        Joi.object({
          productRef: Joi.string().required(),
          amount: Joi.number().integer().min(1).required(),
        })
      )
      .required(),
  });

  return schema.validate(order);
}
