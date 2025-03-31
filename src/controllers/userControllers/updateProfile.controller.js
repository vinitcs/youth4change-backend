import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import { userProfileDataValidationSchema } from "../../utils/helper/validations/profileValidationSchema.js";
import path from "path";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting file: ${filePath}`, error.message);
    }
    // throw new ApiError(500, `Error deleting files: ${error.message}`);

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files) {
    const uploadedFiles = [];

    if (req.files.avatar) {
      uploadedFiles.push(
        `./public/uploads/profile/avatars/${req.files?.avatar[0]?.filename}`
      );
    }
    if (req.files.banner) {
      uploadedFiles.push(
        `./public/uploads/profile/banners/${req.files?.banner[0]?.filename}`
      );
    }

    for (const file of uploadedFiles) {
      try {
        await deleteFileIfExists(file);
      } catch (error) {
        throw new ApiError(
          500,
          `Failed to delete file: ${file} and error ${error.message}`
        );
      }
    }
  }
};

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const validatedData = await userProfileDataValidationSchema.validateAsync(
      req.body,
      { abortEarly: false }
    ); // Collect all validation errors if any);

    const userId = req.user._id; // Access user _id from JWT

    // // Prepare updated data for fields that are allowed to be changed
    // const updatedData = { ...validatedData };

    const user = await User.findById({ _id: userId });

    if (!user) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    // Check email is already used by another user
    if (validatedData.email) {
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        await deleteUploadedFiles(req);

        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              { inputEmail: validatedData.email },
              "Email is already in use by another user."
            )
          );
      }
    }
    // Handle avatar file upload
    if (req.files && req.files.avatar) {
      const avatarPath = `/uploads/profile/avatars/${req.files?.avatar[0]?.filename}`;
      validatedData.avatar = avatarPath; // Save image URL in avatar field

      //Delete old avatar file from localstorage if exist
      if (user.avatar) {
        const oldAvatarPath = path.join("./public", `${user.avatar}`);
        await deleteFileIfExists(oldAvatarPath);
      }
    }

    // Prepare final updatedData while checking for empty values
    const updatedData = {
      name: validatedData.name?.trim() || user.name,
      email: validatedData.email?.trim() || user.email,
      dob: validatedData.dob || user.dob,
      age: validatedData.age || user.age,
      gender: validatedData.gender?.trim() || user.gender,
      cast: validatedData.cast?.trim() || user.cast,
      religion: validatedData.religion?.trim() || user.religion,
      bloodGroup: validatedData.bloodGroup?.trim() || user.bloodGroup,

      phone:  validatedData.phone ? `+91${validatedData.phone.trim()}` : user.phone,
      
      city: validatedData.city?.trim() || user.city,
      state: validatedData.state?.trim() || user.state,
      education: validatedData.education?.trim() || user.education,
      college: validatedData.college?.trim() || user.college,
      avatar: validatedData.avatar || user.avatar, // Ensure avatar is retained
    };

    // Remove undefined or empty values (ensuring no accidental overrides)
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === "" || updatedData[key] === null) {
        updatedData[key] = user[key]; // Retain previous value
      }
    });

    // update user profile
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      updatedData,
      {
        new: true, // Return the updated user document
        runValidators: true, // schema validators are applied
      }
    ).select("-refreshToken");

    if (!updatedUser) {
      await deleteUploadedFiles(req);

      throw new ApiError(500, "Failed to update profile in db.");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          updatedUser: {
            ...updatedUser.toObject(),
          },
        },
        "Profile updated successfully!"
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

export { updateProfile };
