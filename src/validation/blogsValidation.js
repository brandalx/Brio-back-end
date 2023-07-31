import Joi from "joi";

export function validateBlogPost(reqBody) {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    content: Joi.object({
      blocks: Joi.array().required(),
      entityMap: Joi.object().required(),
    }).required(),
    // cover: Joi.object().required(),
    userRef: Joi.string().optional(),
  });

  return schema.validate(reqBody);
}
