import { Admin } from "../../models/admin.model.js";
// import { AdminAccessToken } from "../../models/adminAccessToken.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { generateAdminAccessAndRefreshToken } from "../../utils/helper/generateAccessAndRefreshToken.js";
import { signUpAdminValidationSchema } from "../../utils/helper/validations/adminValidationSchame.js";

const adminSignUp = asyncHandler(async (req, res) => {
  try {
    const { otp, ...validBody } = req.body; // Exclude otp from validation

    // console.log("...validBody", validBody);

    const { name, email, password } =
      await signUpAdminValidationSchema.validateAsync(validBody);

    // Check if admin already exists
    const existedAdmin = await Admin.findOne({ email: email });

    if (existedAdmin) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            { email: email },
            `Admin with email already exists.`
          )
        );
    }

    // Create admin
    const admin = await Admin.create({
      name: name,
      email: email,
      password: password,
    });

    if (!admin || admin.length === 0) {
      throw new ApiError(
        500,
        "Something went wrong while registering the admin"
      );
    }

    const { accessToken, refreshToken } = await generateAdminAccessAndRefreshToken(
      admin._id
    );

    // // create the corressponding document to store accessToken on db under accessToken model
    // const accessTokenResult = await AdminAccessToken.create({
    //   adminId: admin._id,
    //   token: accessToken,
    // });

    // if (!accessTokenResult || accessTokenResult.length === 0) {
    //   throw new ApiError(
    //     500,
    //     "Something went wrong while storing access token in db"
    //   );
    // }

    // store refresh token in admin model
    admin.refreshToken = refreshToken;
    const updateAdminRefreshToken = await admin.save();

    if (!updateAdminRefreshToken || updateAdminRefreshToken.length === 0) {
      throw new ApiError(
        500,
        "Something went wrong while storing refresh token in db"
      );
    }

    // const options = {
    //   httpOnly: true,
    //   secure: true, // Ensures the cookie is only sent over HTTPS
    //   sameSite: "None", // Allows the cookie to be sent in cross-origin requests (important for mobile apps)
    //   maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time
    // };

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        .json(
          new ApiResponse(
            200,
            // {},
            { accessToken, refreshToken, accessTokenExpiresIn: 60 * 60 * 24 }, //Access Token expiration time (1 day),
            "Sign up successfully."
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

export { adminSignUp };
