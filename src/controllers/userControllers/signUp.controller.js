// import { AccessToken } from "../../models/accessToken.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { generateAccessAndRefreshToken } from "../../utils/helper/generateAccessAndRefreshToken.js";
import { parseObjectField } from "../../utils/helper/parse/parseObjectField.js";
import { signUpUserValidationSchema } from "../../utils/helper/validations/userValidationSchema.js";
import fs from "fs/promises";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting post file: ${filePath}`, error.message);
    }

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      let folder = null;

      if (file.mimetype.startsWith("image/")) {
        folder = "images"; // Store images in 'images' folder
      } else if (file.mimetype === "application/pdf") {
        folder = "pdfs"; // Store PDFs in 'proofPdfs' folder
      }

      if (folder) {
        // Ensure the folder is determined before deleting
        const filePath = `./public/uploads/profile/${folder}/${file.filename}`;
        try {
          await deleteFileIfExists(filePath);
        } catch (error) {
          throw new ApiError(
            500,
            `Failed to delete file: ${filePath}, Error: ${error.message}`
          );
        }
      }
    }
  }
};

const signUp = asyncHandler(async (req, res) => {
  try {
    // const { otp, ...validBody } = req.body; // Exclude otp from validation
    // console.log("...validBody", validBody);

    // const { userData } = req.body;
    // const {  name,
    //   email,
    //   dob,
    //   age,
    //   gender,
    //   caste,
    //   religion,
    //   bloodGroup,
    //   phone,
    //   city,
    //   state,
    //   education,
    //   college,
    //   yearOfAdmission,
    //   password, } = req.body;

    req.body.guardianDetails = parseObjectField(
      req.body.guardianDetails,
      "guardianDetails"
    );

    const validatedData = await signUpUserValidationSchema.validateAsync(
      req.body
    );

    if (!validatedData.hasDeclareConsented) {
      await deleteUploadedFiles(req);

      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            `You have not accept the declaration consent.`
          )
        );
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email: validatedData.email });

    if (existedUser) {
      await deleteUploadedFiles(req);

      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            { email: validatedData.email },
            `User with email already exists.`
          )
        );
    }

    // Process media uploads and text posts
    let mediaArray = [];

    if (req.files) {
      console.log("user proof files", req.files);

      req.files?.forEach((file) => {
        mediaArray.push({
          url: file.mimetype.startsWith("image/")
            ? `/uploads/profile/images/${file.filename}`
            : file.mimetype === "application/pdf"
              ? `/uploads/profile/pdfs/${file.filename}`
              : "",

          type: file.mimetype.startsWith("image/")
            ? `image`
            : file.mimetype === "application/pdf"
              ? `pdf`
              : "",
        });
      });
    }

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      dob: validatedData.dob,
      age: validatedData.age,
      gender: validatedData.gender,
      caste: validatedData.caste,
      religion: validatedData.religion,
      bloodGroup: validatedData.bloodGroup,
      phone: `+91${validatedData.phone}`,
      city: validatedData.city,
      village: validatedData.village,
      district: validatedData.district,
      state: validatedData.state,
      aadharNumber: validatedData.aadharNumber,
      education: validatedData.education,
      college: validatedData.college,
      yearOfAdmission: validatedData.yearOfAdmission,
      password: validatedData.password,
      media: mediaArray,
      hasMediaConsented: validatedData.hasMediaConsented,
      isUnderEighteen: validatedData.isUnderEighteen,
      guardianDetails: validatedData.guardianDetails,
      hasDeclareConsented: validatedData.hasDeclareConsented,
    });

    if (!user || user.length === 0) {
      await deleteUploadedFiles(req);

      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // // create the corressponding document to store accessToken on db under accessToken model
    // const accessTokenResult = await AccessToken.create({
    //   userId: user._id,
    //   token: accessToken,
    // });

    // if (!accessTokenResult || accessTokenResult.length === 0) {
    //   throw new ApiError(
    //     500,
    //     "Something went wrong while storing access token in db"
    //   );
    // }

    // store refresh token in user model
    user.refreshToken = refreshToken;
    const updateUserRefreshToken = await user.save();

    if (!updateUserRefreshToken || updateUserRefreshToken.length === 0) {
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
    await deleteUploadedFiles(req);

    if (error.isJoi) {
      // Handle JOI validation errors
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
    }

    throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { signUp };
