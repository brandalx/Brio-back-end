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


export function validateUserOrder(order) {
  const schema = Joi.object({
    restaurant: Joi.string().min(2).max(150).required(),
    status: Joi.string()
      .valid("In progress", "Completed", "Canceled", "Suspended", "cancelled")
      .required(),
    paymentSummary: Joi.object({
      couponCode: Joi.string().allow(null).allow("").min(2).max(150).optional(),
      subtotal: Joi.number().required(),
      tips: Joi.number().optional().allow(null),
      shipping: Joi.number().required(),
      discount: Joi.number().required(),
      totalAmount: Joi.number().required(),
    }).required(),
  });

  return schema.validate(order);
}

