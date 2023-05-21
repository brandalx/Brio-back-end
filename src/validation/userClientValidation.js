import Joi from "joi";

export function validateUserClient(_reqBody) {
  const joiSchema = Joi.object({
    firstname: Joi.string().min(2).max(150).required(),
    lastname: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().min(2).max(150).required(),
    birthdate: Joi.date().required(),
    nickname: Joi.string().min(2).max(150).optional().allow(null, ""),
    avatar: Joi.string().min(2).max(150).optional().allow(null, ""),
    password: Joi.string().min(2).max(150).required(),
    cart: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          productAmount: Joi.number().required(),
        })
      )
      .optional()
      .allow(null),
    comments: Joi.array()
      .items(
        Joi.object({
          comment: Joi.string().required(),
          date: Joi.date().required(),
        })
      )
      .optional()
      .allow(null),
    rate: Joi.array()
      .items(
        Joi.object({
          blogId: Joi.number().required(),
          rating: Joi.number().required(),
        })
      )
      .optional()
      .allow(null),
    address: Joi.array()
      .items(
        Joi.object({
          country: Joi.string().min(2).max(150).required(),
          state: Joi.string().min(2).max(150).required(),
          city: Joi.string().min(2).max(150).required(),
          address1: Joi.string().min(2).max(150).required(),
          address2: Joi.string().min(2).max(150).optional().allow(null, ""),
        })
      )
      .optional()
      .allow(null),
    creditdata: Joi.array()
      .items(
        Joi.object({
          paymentMethod: Joi.string().min(2).max(150).required(),
          cardNumber: Joi.string().min(2).max(150).required(),
          expirationDate: Joi.string().min(2).max(150).required(),
          securityCode: Joi.string().min(2).max(150).required(),
        })
      )
      .optional()
      .allow(null),
    orders: Joi.array()
      .items(
        Joi.object({
          orderId: Joi.number().required(),
          restaurant: Joi.string().min(2).max(150).required(),
          creationDate: Joi.date().required(),
          creationTime: Joi.string().min(2).max(150).required(),
          status: Joi.string()
            .valid("placed", "prepared", "out", "delivered", "cancelled")
            .required(),
          totalAmount: Joi.number().required(),
          paymentSummary: Joi.object({
            couponCode: Joi.string().min(2).max(150).optional().allow(null, ""),
            tips: Joi.number().optional().allow(null),
          }).optional(),
        })
      )
      .optional()
      .allow(null),
    role: Joi.string().min(2).max(150).optional().default("USER"),
    favorites: Joi.array()
      .items(
        Joi.object({
          restaurant: Joi.string().min(2).max(150).required(),
          dishes: Joi.array().items(Joi.number().required()).required(),
        })
      )
      .optional()
      .allow(null),
    phone: Joi.string().min(2).max(150).required(),
    emailnotifications: Joi.boolean().optional(),
    date_created: Joi.date().default(Date.now),
  });
  return joiSchema.validate(_reqBody);
}
