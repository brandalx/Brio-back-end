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
    userdata: Joi.object({
      selectedAddress: Joi.string().min(2).max(150).required(),
      selectedPaymentMethod: Joi.string().min(2).max(150).required(),
      status: Joi.string().valid("Placed").required(),
      paymentSummary: Joi.object({
        subtotal: Joi.number().required(),
        tips: Joi.number().optional().allow(null),
        shipping: Joi.number().optional().allow(null),
        totalAmount: Joi.number().required(),
      }).required(),
    }).required(),
    ordersdata: Joi.object({
      products: Joi.array().items(
        Joi.object({
          productId: Joi.string().min(2).max(150).required(),
          amount: Joi.number().required(),
          restaurantId: Joi.string().min(2).max(150).required(),
        })
      ),
      restaurants: Joi.array().items(Joi.string()),
    }).required(),
  });

  return schema.validate(order);
}

export function validateOrderStatus(order) {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    orderstatus: Joi.string()
      .min(1)
      .max(50)
      .required()
      .allow(
        "Cancelled",
        "Delivered",
        "Completed",
        "In progress",
        "Canceled",
        "Suspended",
        "Delivered"
      ),
  });

  return schema.validate(order);
}
