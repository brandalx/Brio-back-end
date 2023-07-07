import Joi from "joi";

export function validateUserClient(_reqBody) {
  const joiSchema = Joi.object({
    firstname: Joi.string().min(2).max(150).required(),
    lastname: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().min(2).max(150).required(),
    birthdate: Joi.date().required(),
    nickname: Joi.string().min(2).max(150).allow(null).optional(),
    avatar: Joi.string().min(2).max(150).allow(null).optional(),
    password: Joi.string().min(2).max(150).required(),
    cart: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().strip(), // Exclude the _id property from validation
          productId: Joi.string().required(),
          productAmount: Joi.number().required(),
        }).unknown(true) // Allow unknown properties within cart objects
      )
      .optional(),
    comments: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().strip(),
          comment: Joi.string().allow(null).optional(),
          date: Joi.date().allow(null).optional(),
        }).unknown(true)
      )
      .optional(),
    rate: Joi.array()
      .items(
        Joi.object({
          blogId: Joi.number().required(),
          rating: Joi.number().required(),
        }).unknown(true)
      )
      .optional(),
    address: Joi.array()
      .items(
        Joi.object({
          country: Joi.string().min(2).max(150).required(),
          state: Joi.string().min(2).max(150).required(),
          city: Joi.string().min(2).max(150).required(),
          address1: Joi.string().min(2).max(150).required(),
          address2: Joi.string().min(2).max(150).allow(null).optional(),
        }).unknown(true)
      )
      .optional(),
    creditdata: Joi.array()
      .items(
        Joi.object({
          paymentMethod: Joi.string()
            .min(2)
            .max(150)
            .default("Credit Card")
            .required(),
          cardType: Joi.string().min(2).max(150).default("visa").required(),
          cardNumber: Joi.string().min(2).max(150).required(),
          expirationDate: Joi.string().min(2).max(150).required(),
          cardholder: Joi.string().min(2).max(150).required(),
          securityCode: Joi.string().min(2).max(150).required(),
        }).unknown(true)
      )
      .optional(),
    orders: Joi.array()
      .items(
        Joi.object({
          orderId: Joi.number().required(),
          restaurant: Joi.string().min(2).max(150).required(),
          creationDate: Joi.date().required(),
          creationTime: Joi.string().min(2).max(150).required(),
          status: Joi.string()
            .valid(
              "In progress",
              "Completed",
              "Canceled",
              "Suspended",
              "cancelled"
            )
            .required(),
          paymentSummary: Joi.object({
            couponCode: Joi.string()
              .allow(null)
              .allow("")
              .min(2)
              .max(150)
              .optional(),
            subtotal: Joi.number().required(),
            tips: Joi.number().optional().allow(null),
            shipping: Joi.number().required(),
            discount: Joi.number().required(),
            totalAmount: Joi.number().required(),
          }).required(),
        }).unknown(true)
      )
      .optional(),
    role: Joi.string().min(2).max(150).default("USER").optional(),
    favorites: Joi.array()
      .items(
        Joi.object({
          restaurant: Joi.string().min(2).max(150).required(),
          dishes: Joi.array().items(Joi.number().required()).required(),
        }).unknown(true)
      )
      .optional(),
    phone: Joi.string().min(2).max(150).required(),
    emailnotifications: Joi.boolean().optional(),
    date_created: Joi.date().default(Date.now),
  })
    .unknown(true)
    .strip();

  return joiSchema.validate(_reqBody);
}

export function validateUserClientData(_reqBody) {
  const joiSchema = Joi.object({
    firstname: Joi.string().min(2).max(150).required(),
    lastname: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().min(2).max(150).required(),
    phone: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientAddress(_reqBody) {
  const joiSchema = Joi.object({
    country: Joi.string().min(2).max(150).required(),
    state: Joi.string().min(2).max(150).required(),
    city: Joi.string().min(2).max(150).required(),
    address1: Joi.string().min(2).max(150).required(),
    address2: Joi.string().min(0).max(150).allow(null, " "),
  });

  return joiSchema.validate(_reqBody);
}
export function validateUserClientAddressPut(_reqBody) {
  const joiSchema = Joi.object({
    country: Joi.string().min(2).max(150).required(),
    state: Joi.string().min(2).max(150).required(),
    city: Joi.string().min(2).max(150).required(),
    address1: Joi.string().min(2).max(150).required(),
    address2: Joi.string().min(0).max(150).allow(null, " "),
    _id: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientCard(_reqBody) {
  const joiSchema = Joi.object({
    cardType: Joi.string().min(2).max(150).required(),
    cardNumber: Joi.string().min(2).max(150).required(),
    expirationDate: Joi.string().min(2).max(150).required(),
    cardholder: Joi.string().min(2).max(150).required(),
    securityCode: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientCardPut(_reqBody) {
  const joiSchema = Joi.object({
    cardType: Joi.string().min(2).max(150).required(),
    cardNumber: Joi.string().min(2).max(150).required(),
    expirationDate: Joi.string().min(2).max(150).required(),
    cardholder: Joi.string().min(2).max(150).required(),
    securityCode: Joi.string().min(2).max(150).required(),
    _id: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientCart(_reqBody) {
  const joiSchema = Joi.object({
    productId: Joi.string().required(),
    productAmount: Joi.number().required(),
  }).required();

  return joiSchema.validate(_reqBody);
}

export function validateUserPost(_reqBody) {
  const joiSchema = Joi.object({
    type: Joi.string().min(3).max(10).required(),
    firstname: Joi.string().min(3).max(10).required(),
    lastname: Joi.string().min(3).max(10).required(),
    email: Joi.string().min(3).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
    confirmpassword: Joi.string().min(3).max(150).required(),
    phone: Joi.string().min(3).max(150).required(),
  }).required();

  return joiSchema.validate(_reqBody);
}

export function validateUserLogin(_reqBody) {
  const joiSchema = Joi.object({
    email: Joi.string().min(3).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
  }).required();

  return joiSchema.validate(_reqBody);
}

export function validateUserSecurity(_reqBody) {
  const joiSchema = Joi.object({
    previouspassword: Joi.string().min(3).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
    confirmpassword: Joi.string().min(3).max(150).required(),
  }).required();

  return joiSchema.validate(_reqBody);
}

export function validateUserClientAddressToDelete(_reqBody) {
  const joiSchema = Joi.object({
    addressToDelete: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientCardToDelete(_reqBody) {
  const joiSchema = Joi.object({
    cardToDelete: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserClientCartItemToDelete(_reqBody) {
  const joiSchema = Joi.object({
    itemToDelete: Joi.string().min(2).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserRecoveryBody(_reqBody) {
  const joiSchema = Joi.object({
    email: Joi.string().min(6).max(150).required(),
    phone: Joi.string().min(6).max(14).required(),
  });

  return joiSchema.validate(_reqBody);
}

export function validateUserResetBody(_reqBody) {
  const joiSchema = Joi.object({
    token: Joi.string().min(6).max(500).required(),
    password: Joi.string().min(6).max(150).required(),
    confirmpassword: Joi.string().min(6).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
}
