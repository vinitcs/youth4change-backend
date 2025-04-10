import Joi from "joi";

const addGalleryValidationSchema = Joi.object({
  description: Joi.string().allow("").optional(),

  category: Joi.string().allow("").optional(),

  image: Joi.any().optional(),
  video: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a gallery.",
});

const updateGalleryValidationSchema = Joi.object({
  galleryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Match MongoDB ObjectId
    .required()
    .messages({
      "string.pattern.base": "Gallery Id must be a valid MongoDB ObjectId.",
      "any.required": "Gallery Id is required.",
    }),

  description: Joi.string().allow("").optional(),

  category: Joi.string().optional(),

  image: Joi.any().optional(),
  video: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a gallery.",
});

export { addGalleryValidationSchema, updateGalleryValidationSchema };
