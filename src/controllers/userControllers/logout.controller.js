import { AccessToken } from "../../models/accessToken.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const logout = asyncHandler(async (req, res) => {
  try {
    // If cookie is used
    // const options = {
    //   httpOnly: true,
    //   secure: true, // Ensures the cookie is only sent over HTTPS
    //   sameSite: "None", // Allows the cookie to be sent in cross-origin requests (important for mobile apps)
    //   path: "/"
    // };

    // res.clearCookie("accessToken", options);

    const userId = req.user._id;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    // clear refresh token
    user.refreshToken = null;
    const clearRefreshToken = await user.save();

    if (!clearRefreshToken) {
      throw new ApiError(
        500,
        "Something went wrong to clear user refresh token in db"
      );
    }

    const deleteUserAccessTokenDocument = await AccessToken.findOneAndDelete({
      userId: userId,
    });

    if (!deleteUserAccessTokenDocument) {
      throw new ApiError(
        500,
        "Something went wrong to delete user access token"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "logged out successfully"));
  } catch (error) {
    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { logout };
