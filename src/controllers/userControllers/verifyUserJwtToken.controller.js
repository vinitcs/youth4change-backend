import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";

const verifyUserJwtToken = asyncHandler(async (req, res) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // the space after Bearer

    if (!token) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Unauthorized user request."));
    }

    const decodedToken = jwt.verify(
      // token.accessToken,
      token,
      process.env.USER_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(200)
        .json(new ApiResponse(200, { isAuthorised: false }, "User not found."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isAuthorised: true }, "Access token verified")
      );
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid Access Token."));
  }
});

export { verifyUserJwtToken };
