import Joi from "joi";

export function validateUserSeller(_reqBody) {
  const joiSchema = Joi.object({
    firstname: Joi.string().min(2).max(150).required(),
    lastname: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().min(2).max(150).required(),
    phone: Joi.string().min(2).max(150).required(),
    company: Joi.string().min(2).max(150).required(),
  });
  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
