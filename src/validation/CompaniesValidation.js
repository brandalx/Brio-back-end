import Joi from "joi";
// Joi validator for created schema
export function validateCompanies(_reqBody) {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    // todo: roles validation
  });

  return joiSchema.validate(_reqBody);
}

//todo: correct validation according on future requests (in future releases)
