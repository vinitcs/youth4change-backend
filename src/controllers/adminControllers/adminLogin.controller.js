import { Admin } from "../../models/admin.model.js";
// import { AdminAccessToken } from "../../models/adminAccessToken.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { generateAdminAccessAndRefreshToken } from "../../utils/helper/generateAccessAndRefreshToken.js";
import { loginAdminValidationSchema } from "../../utils/helper/validations/adminValidationSchame.js";

const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = await loginAdminValidationSchema.validateAsync(
      req.body
    );

    // check already admin present in db
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            { email: email },
            `Admin not found with the provided email.`
          )
        );
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Invalid password.`));
    }

    // Generate a new access token
    const { accessToken, refreshToken } =
      await generateAdminAccessAndRefreshToken(admin._id);

    //Check already token of that admin is present on db or not
    // const accessTokenAlreadyPresent = await AccessToken.findOne({
    //   adminId: admin._id,
    // });

    // if (!accessTokenAlreadyPresent) {
    //   // create the corressponding document to store accessToken if already not present on db
    //   const accessTokenResult = await AccessToken.create({
    //     adminId: admin._id,
    //     accessToken: accessToken,
    //   });

    //   if (!accessTokenResult) {
    //     throw new ApiError(
    //       500,
    //       "Something went wrong while storing access token on db"
    //     );
    //   }
    // }

    // // Find and update or create the access token document
    // const updateAdminAccessToken = await AdminAccessToken.findOneAndUpdate(
    //   { adminId: admin._id },
    //   { token: accessToken },
    //   { upsert: true, new: true }
    // );

    // if (!updateAdminAccessToken) {
    //   throw new ApiError(
    //     500,
    //     "Something went wrong to update admin access token"
    //   );
    // }

    admin.refreshToken = refreshToken;
    const updateAdminRefreshToken = await admin.save();

    if (!updateAdminRefreshToken) {
      throw new ApiError(
        500,
        "Something went wrong to update admin refresh token"
      );
    }

    // const options = {
    //   httpOnly: true,
    //   secure: true, // Ensures the cookie is only sent over HTTPS
    //   sameSite: "None", // Allows the cookie to be sent in cross-origin requests (important for mobile apps)
    //   maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1d)
    // };

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        .json(
          new ApiResponse(
            200,
            // {},
            { accessToken, refreshToken, accessTokenExpiresIn: 15 * 60 }, // Access Token expiration time (15 mins),
            "Login successful!"
          )
        )
    );
  } catch (error) {
    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }

    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { adminLogin };
