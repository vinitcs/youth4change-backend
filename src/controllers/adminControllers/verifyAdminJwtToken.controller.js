import { Admin } from "../../models/admin.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyAdminJwtToken = asyncHandler(async (req, res, next) => {
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

    const admin = await Admin.findById(decodedToken?._id)
      .select("-password -refreshToken")
      .lean();

    if (!admin) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { isAuthorised: false }, "Admin not found.")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isAuthorised: true }, "Access token verified")
      );
  } catch (error) {
    // throw new ApiError(401, error.message || "Invalid Access Token");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid Access Token."));
  }
});

export { verifyAdminJwtToken };
