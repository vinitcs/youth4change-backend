import { Admin } from "../../models/admin.model.js";
import { AdminAccessToken } from "../../models/adminAccessToken.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const adminLogout = asyncHandler(async (req, res) => {
  try {
    // If cookie is used
    // const options = {
    //   httpOnly: true,
    //   secure: true, // Ensures the cookie is only sent over HTTPS
    //   sameSite: "None", // Allows the cookie to be sent in cross-origin requests (important for mobile apps)
    //   path: "/"
    // };

    // res.clearCookie("accessToken", options);

    const adminId = req.admin._id;

    const admin = await Admin.findById({ _id: adminId });

    if (!admin) {
      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    // clear refresh token
    admin.refreshToken = null;
    const clearRefreshToken = await admin.save();

    if (!clearRefreshToken) {
      throw new ApiError(
        500,
        "Something went wrong to clear admin refresh token in db"
      );
    }

    const deleteAdminAccessTokenDocument = await AdminAccessToken.findOneAndDelete({
      adminId: adminId,
    });

    if (!deleteAdminAccessTokenDocument) {
      throw new ApiError(
        500,
        "Something went wrong to delete admin access token"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "logged out successfully"));
  } catch (error) {
    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { adminLogout };
