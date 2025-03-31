import Joi from "joi";

const userProfileDataValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 100 characters.",
    // "string.empty": "Name is required.",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Please enter a valid email address.",
    // "string.empty": "Email is required.",
  }),

  dob: Joi.string().optional().messages({
    // "any.required": "DOB is required.",
  }),

  age: Joi.number().optional().messages({
    // "any.required": "Age is required.",
  }),

  gender: Joi.string().optional().messages({
    // "any.required": "Gender is required.",
  }),

  cast: Joi.string().optional().messages({
    // "any.required": "Cast is required.",
  }),

  religion: Joi.string().optional().messages({
    // "any.required": "Religion is required.",
  }),

  bloodGrup: Joi.string().optional().messages({
    // "any.required": "Blood Group is required.",
  }),

  phone: Joi.string().optional().messages({
    // "any.required": "Phone is required.",
  }),

  city: Joi.string().optional().messages({
    // "any.required": "City is required.",
  }),

  state: Joi.string().optional().messages({
    // "any.required": "State is required.",
  }),

  education: Joi.string().optional().messages({
    // "any.required": "Education is required.",
  }),

  college: Joi.string().optional().messages({
    // "any.required": "College is required.",
  }),
});

export { userProfileDataValidationSchema };
