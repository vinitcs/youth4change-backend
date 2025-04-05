// import { AccessToken } from "../models/accessToken.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/helper/ApiResponse.js";
import { asyncHandler } from "../utils/helper/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // the space after Bearer

    if (!token) {
      // throw new ApiError(401, "Unauthorized request");
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Unauthorized user request."));
    }

    const decodedToken = jwt.verify(
      // token.accessToken,
      token,
      process.env.USER_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken").lean();

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    // // Check if the token exists in the AccessToken database
    // const accessTokenData = await AccessToken.findOne({
    //   userId: user._id,
    //   token,
    // });

    // if (!accessTokenData) {
    //   return res
    //     .status(404)
    //     .json(new ApiResponse(404, {}, "Access Token not found."));
    // }

    // if (token !== accessTokenData.token) {
    //   return res
    //     .status(401)
    //     .json(new ApiResponse(401, {}, "Invalid Access Token."));
    // }

    req.user = user; // add to req.user giving access of user for loggedUser and profileProgress.

    console.log("hi");
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // throw new ApiError(401, "Access Token has expired. Please log in again.");
      return res
        .status(419)
        .json(
          new ApiResponse(
            419,
            {},
            "Access Token has expired. Please log in again."
          )
        );
    }

    // throw new ApiError(401, error.message || "Invalid Access Token");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid Access Token."));
  }
});

export { verifyJWT };
