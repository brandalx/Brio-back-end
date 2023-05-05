import Joi from "joi";

export function validateUserClient(_reqBody) {
  const joiSchema = Joi.object({
    firstname: Joi.string().min(2).max(150).required(),
    lastname: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().min(2).max(150).required(),
    birthdate: Joi.date().required(),
    nickname: Joi.string().min(2).max(150).optional().required(),
    avatar: Joi.string().min(2).max(150).optional().allow(null, ""),
    password: Joi.string().min(2).max(150).required(),
    address: Joi.object({
      country: Joi.string().min(2).max(150).optional().allow(null, ""),
      state: Joi.string().min(2).max(150).optional().allow(null, ""),
      city: Joi.string().min(2).max(150).optional().allow(null, ""),
      address1: Joi.string().min(2).max(150).optional().allow(null, ""),
      address2: Joi.string().min(2).max(150).optional().allow(null, ""),
    })
      .optional()
      .allow(null, ""),
    phone: Joi.string().min(2).max(150).required(),
  });
  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
