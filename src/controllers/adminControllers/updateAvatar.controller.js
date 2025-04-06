import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import path from "path";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";

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
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    console.log("file", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "No file uploaded."));
    }

    const avatarPath = `/uploads/profile/avatars/${req.file.filename}`;

    // Delete old avatar if exists
    if (admin.avatar) {
      const oldAvatarPath = path.join("./public", `${admin.avatar}`);
      await deleteFileIfExists(oldAvatarPath);
    }

    admin.avatar = avatarPath;
    await admin.save();

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
