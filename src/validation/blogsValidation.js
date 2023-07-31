import Joi from "joi";

export function validateBlogPost(reqBody) {
  reqBody.content = JSON.parse(reqBody.content);
  reqBody.tags = JSON.parse(reqBody.tags);

  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    content: Joi.object({
      blocks: Joi.array().required(),
      entityMap: Joi.object().required(),
    }).required(),
    userRef: Joi.string().optional(),
  });

  return schema.validate(reqBody);
}
