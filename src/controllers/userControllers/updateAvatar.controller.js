import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
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
    // throw new ApiError(500, `Error deleting file: ${error.message}`);

    return false; // File did not exist or could not be deleted
  }
};

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    console.log("file", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "No file uploaded."));
    }

    const avatarPath = `/uploads/profile/avatars/${req.file.filename}`;

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join("./public", `${user.avatar}`);
      await deleteFileIfExists(oldAvatarPath);
    }

    user.avatar = avatarPath;
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { avatar: avatarPath },
          "Avatar updated successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, `Error updating avatar: ${error.message}`);
  }
});

export { updateAvatar };
