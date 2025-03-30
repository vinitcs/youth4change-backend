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
    // Delete uploaded file if if invalid JSON

    // const uploadedFilePath = path.join(
    //   "./public/uploads/avatars",
    //   req.file.filename
    // );
    // await deleteFileIfExists(uploadedFilePath);

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

const generateUniqueUserTag = async (name, userId = null) => {
  const nameParts = name.toLowerCase().split(" ").filter(Boolean);
  let baseUserTag =
    nameParts[0] +
    (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");

  let uniqueUserTag = `@${baseUserTag}`;
  let counter = 1;

  while (await User.findOne({ nameTag: uniqueUserTag, _id: { $ne: userId } })) {
    if (nameParts.length > 2 && counter === 1) {
      // Include middle name only if first-last combo already exists
      uniqueUserTag = `@${nameParts[0] + nameParts[1] + nameParts[2]}`;
    } else {
      uniqueUserTag = `@${baseUserTag}${counter}`;
    }
    counter++;
  }

  return uniqueUserTag;
};

const updateProfile = asyncHandler(async (req, res) => {
  try {
    if (req.body.interest) {
      try {
        // Parse the interest field if it's sent as JSON string in form-data
        req.body.interest = JSON.parse(req.body.interest);
      } catch (error) {
        await deleteUploadedFiles(req);

        // throw new ApiError(400, "Invalid JSON format for interest field.");
        return res.status(400).json(
          // new ApiResponse(400, {}, "Invalid JSON format for interest field.")
          new ApiResponse(400, {}, "Error parsing interest data.")
        );
      }
    }

    const validatedData = await userProfileDataValidationSchema.validateAsync(
      req.body,
      { abortEarly: false }
    ); // Collect all validation errors if any);

    const userId = req.user._id; // Access user _id from JWT

    // Prepare updated data for fields that are allowed to be changed
    const updatedData = { ...validatedData };

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

    // Exclude badge, eventOrganized, and donationAmount from updates
    delete updatedData.badge;
    delete updatedData.eventOrganized;
    delete updatedData.donationAmount;

    // Handle avatar file upload
    if (req.files && req.files.avatar) {
      const avatarPath = `/uploads/profile/avatars/${req.files?.avatar[0]?.filename}`;
      updatedData.avatar = avatarPath; // Save image URL in avatar field

      //Delete old avatar file from localstorage if exist
      if (user.avatar) {
        const oldAvatarPath = path.join("./public", `${user.avatar}`);
        await deleteFileIfExists(oldAvatarPath);
      }
    }

    // Handle banner file upload
    if (req.files && req.files.banner) {
      const bannerPath = `/uploads/profile/banners/${req.files?.banner[0]?.filename}`;
      updatedData.banner = bannerPath;

      // Delete old banner if it exists
      if (user.banner) {
        const oldBannerPath = path.join("./public", user.banner);
        await deleteFileIfExists(oldBannerPath);
      }
    }

    //Handle nameTag update if the name is changed.
    if (validatedData.name && validatedData.name !== user.name) {
      updatedData.nameTag = await generateUniqueUserTag(
        validatedData.name,
        userId
      );
    }

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
