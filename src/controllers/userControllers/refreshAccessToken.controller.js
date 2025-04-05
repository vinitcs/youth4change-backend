// import { AccessToken } from "../../models/accessToken.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import jwt from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // const { refreshToken } = req.body;
    const refreshToken = req.header("authorization");

    if (!refreshToken) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Refresh token is required."));
    }

    // Verify the refresh token
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.USER_REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Invalid or expired refresh token."));
    }

    // Generate a new access token
    const newAccessToken = user.generateAccessToken(); // directly generate from User model if in future also update refresh token then use generateAccessAndRefreshToken util

    // // Find and update or create the access token document
    // const updateUserAccessToken = await AccessToken.findOneAndUpdate(
    //   { userId: user._id },
    //   { token: newAccessToken },
    //   { upsert: true, new: true }
    // );

    // if (!updateUserAccessToken) {
    //   throw new ApiError(500, "Something went wrong to update user token");
    // }

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        .json(
          new ApiResponse(
            200,
            // {},
            { accessToken: newAccessToken, accessTokenExpiresIn: 15 * 60 }, // Access Token expiration time (15 mins),
            "Login successful!"
          )
        )
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Refresh token has expired."));
    }
    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { refreshAccessToken };
