import Joi from "joi";

const addCertificateValidationSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Match MongoDB ObjectId
    .required()
    .messages({
      "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
      "any.required": "User ID is required.",
    }),

  image: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a gallery.",
});

export { addCertificateValidationSchema };
