import { ApiError } from "../ApiError.js";

export const parseArrayField = (field, fieldName = "unknown") => {
  if (Array.isArray(field)) {
    console.log(`parseArrayField field details for ${fieldName}:::`, field);

    return field;
  }
  try {
    return field ? JSON.parse(field) : [];
  } catch (error) {
    throw new ApiError(500, `Invalid format for ${fieldName}`);
  }
};
