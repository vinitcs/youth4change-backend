import { ApiError } from "../ApiError.js";

// General JSON parser for both object and array
export const parseObjectField = (field, fieldName = "unknown") => {
  if (typeof field === "object" && field !== null) {
    console.log(`parseObjectField field details for ${fieldName}:::`, field);
    return field; // Already parsed
  }
  try {
    return field ? JSON.parse(field) : null;
  } catch (error) {
    throw new ApiError(400, `Invalid JSON format for ${fieldName}`);
  }
};
