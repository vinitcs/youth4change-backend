// import { AccessToken } from "../../models/accessToken.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { generateAccessAndRefreshToken } from "../../utils/helper/generateAccessAndRefreshToken.js";
import { loginUserValidationSchema } from "../../utils/helper/validations/userValidationSchema.js";

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = await loginUserValidationSchema.validateAsync(
      req.body
    );

    // check already user present in db
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            { email: email },
            `User not found with the provided email.`
          )
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Invalid password.`));
    }

    // Generate a new access token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    //Check already token of that user is present on db or not
    // const accessTokenAlreadyPresent = await AccessToken.findOne({
    //   userId: user._id,
    // });

    // if (!accessTokenAlreadyPresent) {
    //   // create the corressponding document to store accessToken if already not present on db
    //   const accessTokenResult = await AccessToken.create({
    //     userId: user._id,
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
    // const updateUserAccessToken = await AccessToken.findOneAndUpdate(
    //   { userId: user._id },
    //   { token: accessToken },
    //   { upsert: true, new: true }
    // );

    // if (!updateUserAccessToken) {
    //   throw new ApiError(
    //     500,
    //     "Something went wrong to update user access token"
    //   );
    // }

    user.refreshToken = refreshToken;
    const updateUserRefreshToken = await user.save();

    if (!updateUserRefreshToken) {
      throw new ApiError(
        500,
        "Something went wrong to update user refresh token"
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

export { login };
