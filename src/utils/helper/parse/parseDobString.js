import { ApiError } from "../ApiError.js";

// Utility function to manually parse dd-mm-yyyy format
export function parseDobString(dobString) {
  const [day, month, year] = dobString.split("-");
  if (!day || !month || !year) throw new ApiError(500, "Invalid format");

  const dateObj = new Date(`${year}-${month}-${day}`);
  if (isNaN(dateObj.getTime())) throw new ApiError(500, "Invalid date");
  return dateObj;
}
