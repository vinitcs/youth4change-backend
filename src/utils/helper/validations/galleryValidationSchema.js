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

  description: Joi.string().min(10).max(250).allow("").optional().messages({
    "string.min":
      "Description must be at least 10 characters long (if provided).",
    "string.max": "Description must not exceed 250 characters.",
  }),

  category: Joi.string().optional(),

  image: Joi.any().optional(),
  video: Joi.any().optional(),
}).messages({
  "object.base": "Invalid input data for creating a gallery.",
});

export { addGalleryValidationSchema, updateGalleryValidationSchema };
