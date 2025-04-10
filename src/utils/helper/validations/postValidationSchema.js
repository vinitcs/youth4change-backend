import Joi from "joi";

const addPostValidationSchema = Joi.object({
  description: Joi.string().allow("").optional(),

  link: Joi.string().allow("").optional(),

  image: Joi.any().optional(),
  video: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a post.",
});

const updatePostValidationSchema = Joi.object({
  postId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Match MongoDB ObjectId
    .required()
    .messages({
      "string.pattern.base": "Post Id must be a valid MongoDB ObjectId.",
      "any.required": "Post Id is required.",
    }),

  description: Joi.string().allow("").optional(),

  link: Joi.string().allow("").optional(),

  image: Joi.any().optional(),
  video: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a post.",
});

export { addPostValidationSchema, updatePostValidationSchema };
