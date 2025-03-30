import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const loggedAdmin = asyncHandler(async (req, res) => {
  const admin = req.admin;

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        admin,
      },
      "Logged admin data retrieved successfully."
    )
  );
});

export { loggedAdmin };
