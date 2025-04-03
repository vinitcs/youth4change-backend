import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import path from "path";
// import fs from "fs";
import fs from "fs/promises";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { UserAchievement } from "../../models/UserAchievement.model.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting file: ${filePath}`, error.message);
    }
    // throw new ApiError(500, `Error deleting gallery files: ${error.message}`);
  }
};

const deleteCertificateFromAdminSide = asyncHandler(async (req, res) => {
  const { userAchievementId } = req.body;

  try {
    const userAchievement = await UserAchievement.findById({ _id: userAchievementId });

    if (!userAchievement) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No user achievement data found!"));
    }

    await UserAchievement.deleteOne({ _id: userAchievementId });

    // Now safely delete the associated media files (AFTER transaction commit)
    const filePaths = userAchievement.media
      .filter((mediaItem) => mediaItem.url) // Ensure URL exists
      .map((mediaItem) => path.join("./public", mediaItem.url));

    // Delete all associated media files
    await Promise.all(filePaths.map(deleteFileIfExists));

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User achievement deleted successfully."));
  } catch (error) {
    throw new ApiError(500, `Something went wrong: ${error.message}`);
  }
});

export { deleteCertificateFromAdminSide };
