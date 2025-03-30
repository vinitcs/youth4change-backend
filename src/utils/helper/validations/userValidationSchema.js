import Joi from "joi";

// During verify OTP middleware
const verifyOtpValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/) // Ensures it's numeric
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits.",
      "string.pattern.base": "OTP must only contain numbers.",
      "string.empty": "OTP is required.",
    }),
});

// During signUp/ register
const signUpUserValidationSchema = Joi.object({
  fname: Joi.string().min(3).max(100).required().messages({
    "string.base": "First name must be a string.",
    "string.min": "First name must be at least 3 characters long.",
    "string.max": "First name must not exceed 100 characters.",
    "any.required": "First name is required.",
  }),

  lname: Joi.string().min(3).max(100).required().messages({
    "string.base": "Last name must be a string.",
    "string.min": "Last name must be at least 3 characters long.",
    "string.max": "Last name must not exceed 100 characters.",
    "any.required": "Last name is required.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().required(),
});

// During Login
const loginUserValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().required(),
});

export {
  verifyOtpValidationSchema,
  signUpUserValidationSchema,
  loginUserValidationSchema,
};

//
//
//
//
//
//
//

// countryCode: Joi.string()
//     .pattern(/^\+\d{1,4}$/) // Matches "+1", "+91", "+44", etc.
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Country code must be a valid international dialing code (e.g., +1, +91).",
//       "string.empty": "Country code is required.",
//     }),

// phone: Joi.string()
//   // .pattern(/^(?:\+1\s?)?\(?[2-9]\d{2}\)?[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/)
//   .optional(),
// // .messages({
// // "string.pattern.base": "Phone number must be a valid US phone number.",
// // "string.empty": "Phone number is required.",
// // })
