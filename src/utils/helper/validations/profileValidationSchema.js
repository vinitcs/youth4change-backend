import Joi from "joi";

const userProfileDataValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).allow(null, "").optional().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 100 characters.",
    // "string.empty": "Name is required.",
  }),

  email: Joi.string().email().allow(null, "").optional().messages({
    "string.email": "Please enter a valid email address.",
    // "string.empty": "Email is required.",
  }),

  dob: Joi.string().allow(null, "").optional().messages({
    // "any.required": "DOB is required.",
  }),

  age: Joi.number().allow(null, "").optional().messages({
    // "any.required": "Age is required.",
  }),

  gender: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Gender is required.",
  }),

  cast: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Cast is required.",
  }),

  religion: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Religion is required.",
  }),

  bloodGroup: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Blood Group is required.",
  }),

  phone: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Phone is required.",
  }),

  city: Joi.string().allow(null, "").optional().messages({
    // "any.required": "City is required.",
  }),

  state: Joi.string().allow(null, "").optional().messages({
    // "any.required": "State is required.",
  }),

  education: Joi.string().allow(null, "").optional().messages({
    // "any.required": "Education is required.",
  }),

  college: Joi.string().allow(null, "").optional().messages({
    // "any.required": "College is required.",
  }),
});

const adminProfileDataValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).allow(null, "").optional().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 100 characters.",
    // "string.empty": "Name is required.",
  }),

  email: Joi.string().email().allow(null, "").optional().messages({
    "string.email": "Please enter a valid email address.",
    // "string.empty": "Email is required.",
  }),
});

export { userProfileDataValidationSchema, adminProfileDataValidationSchema };
