import Joi from "joi";

const reportAudacityValidationSchema = Joi.object({
  // reportedBy: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/) // Match MongoDB ObjectId
  //   .required()
  //   .messages({
  //     "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
  //     "any.required": "User ID is required.",
  //   }),
  targetId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Match MongoDB ObjectId
    .required()
    .messages({
      "string.pattern.base": "Target ID must be a valid MongoDB ObjectId.",
      "any.required": "Target ID is required.",
    }),
  targetType: Joi.string()
    .valid(
      "User",
      "Post",
      "Event",
      "NGO",
      "SocialReformer",
      "PostComment",
      "EventComment",
      "NgoComment",
      "SocialReformerComment"
    )
    .required()
    .messages({
      "any.only":
        "Target type must be one of 'User', 'Post', 'Event', 'NGO', 'SocialReformer', 'PostComment', 'EventComment', 'NgoComment','SocialReformerComment'",
      "any.required": "Target type is required.",
    }),
  reason: Joi.string().max(150).required().messages({
    "string.max": "Reason must not exceed 150 characters.",
    "any.required": "Reason is required.",
  }),
  status: Joi.string().valid("Pending", "Resolved").optional().messages({
    "any.only": "Status must be one of 'Pending' or 'Resolved'.",
  }),
});

export { reportAudacityValidationSchema };
