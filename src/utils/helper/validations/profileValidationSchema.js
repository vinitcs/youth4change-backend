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

  countryCode: Joi.string()
    .uppercase() // Ensure it's always uppercase
   
    .optional()
    .messages({
      "any.only":
        "Invalid country code! Use a valid ISO 3166-1 alpha-2 code (e.g., 'US', 'IN').",
      // "string.empty": "Country code is required.",
    }),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/) // Ensures exactly 10 digits
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit valid number.",
      // "string.empty": "Phone number is required.",
    }),

  // phone: Joi.string()
  //   // .pattern(/^(?:\+1\s?)?\(?[2-9]\d{2}\)?[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/)
  //   .optional(),
  // // .messages({
  // // "string.pattern.base": "Phone number must be a valid US phone number.",
  // // "string.empty": "Phone number is required.",
  // // })

  // role: Joi.string().valid("Volunteer", "Influencer/Activist").messages({
  //   "any.only": "Role must be one of 'Volunteer', 'Influencer/Activist'.",
  // }),

  applyForRole: Joi.string().optional(),

  background: Joi.string().min(3).max(50).allow("").optional().messages({
    "string.base": "Background must be a string.",
    // "string.empty": "Background is required.",
    "string.min": "Background must be at least 3 characters long.",
    "string.max": "Background must not exceed 50 characters.",
  }),

  address: Joi.object({
    street: Joi.string().min(4).max(150).allow("").optional().messages({
      "string.base": "Street must be a string.",
    }),
    area: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "Area must be a string.",
    }),
    city: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "City must be a string.",
    }),
    county: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "County must be a string.",
    }),
    state: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "State must be a string.",
    }),
    pinCode: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "pinCode must be a string.",
    }),
    country: Joi.string().min(2).max(40).allow("").optional().messages({
      "string.base": "Country must be a string.",
    }),
  }).optional(),

  dob: Joi.date()
    .optional()
    .iso() // Ensures the date is in ISO 8601 format
    .less("now") // Ensures the date is in the past
    .greater("1900-01-01") // Optional: Ensures the date is reasonably recent
    .messages({
      "date.base": "Date of Birth must be a valid date.",
      "date.less": "Date of Birth must be in the past.",
      "date.greater": "Date of Birth must be after January 1, 1900.",
      // "any.required": "Date of Birth is required.",
    }),

  bio: Joi.string().max(500).allow("").optional().messages({
    "string.max": "Bio must not exceed 500 characters.",
  }),

  interest: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "string.base": "Interest name must be a string.",
          "string.empty": "Interest name is required.",
        }),
        check: Joi.boolean().required().messages({
          "boolean.base": "Interest check status must be a boolean.",
          "any.required": "Interest check status is required.",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Interest must be an array of objects.",
    }),

  badge: Joi.string()
    .valid("None", "Bronze", "Silver", "Gold", "Platinum")
    .default("None")
    .messages({
      "any.only":
        "Badge must be one of 'None', 'Bronze', 'Silver', 'Gold', or 'Platinum'.",
    }),

  eventOrganized: Joi.number().integer().min(0).optional().messages({
    "number.base": "Event Organized must be a number.",
    "number.min": "Event Organized cannot be negative.",
  }),

  donationAmount: Joi.number().min(0).optional().messages({
    "number.base": "Donation Amount must be a number.",
    "number.min": "Donation Amount cannot be negative.",
  }),
});

const roleValidationSchema = Joi.object({
  applyForRole: Joi.string().optional(),
});

export { userProfileDataValidationSchema, roleValidationSchema };

//
//
//
//
//
// avatar: Joi.string().uri().allow(null, "").optional().messages({
//   "string.uri": "Avatar must be a valid URL.",
// }),

// banner: Joi.string().uri().allow(null, "").optional().messages({
//   "string.uri": "Banner must be a valid URL.",
// }),
//
// pinCode: Joi.string()
//       // .length(6)
//       .pattern(/^\d{5}(-\d{4})?$/) // US postal codes (zip codes) vary in length: 5-digit (e.g., 12345),  Extended 9-digit (e.g., 12345-6789)
//       .optional()
//       .allow("")
//       .messages({
//         "string.pattern.base":
//           "Pin code must be exactly 5 digits eg. 87654 or 5 digit - 4 digit eg. 87656-9807.",
//       }),
