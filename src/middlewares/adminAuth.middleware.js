import { Admin } from "../models/admin.model.js";
// import { AdminAccessToken } from "../models/adminAccessToken.model.js";
import { ApiResponse } from "../utils/helper/ApiResponse.js";
import { asyncHandler } from "../utils/helper/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // the space after Bearer

    if (!token) {
      // throw new ApiError(401, "Unauthorized request");
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Unauthorized admin request."));
    }

    const decodedToken = jwt.verify(
      // token.accessToken,
      token,
      process.env.ADMIN_ACCESS_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken").lean();

    if (!admin) {
      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    // // Check if the token exists in the AccessToken database
    // const accessTokenData = await AdminAccessToken.findOne({
    //   adminId: admin._id,
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

    req.admin = admin; // add to req.admin giving access of admin for loggedAdmin and profileProgress.

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

export { verifyAdminJWT };
