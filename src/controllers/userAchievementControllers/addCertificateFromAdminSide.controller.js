import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";
import { addCertificateValidationSchema } from "../../utils/helper/validations/userAchievementValidationSchema.js";
import { UserAchievement } from "../../models/UserAchievement.model.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        `Error deleting user achievement certificate file: ${filePath}`,
        error.message
      );
    }

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const filePath = `./public/uploads/user/achievement/certificate/pdfs/${file.filename}`;
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
};

const addCertificateFromAdminSide = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // get id from jwt middleware

  try {
    // Validate input data
    const validatedData = await addCertificateValidationSchema.validateAsync(
      req.body
    );

    const admin = await Admin.findById({ _id: adminId });

    // Check if admin exists
    if (!admin) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    // Process media uploads
    let mediaArray = [];

    if (req.files) {
      console.log("post files", req.files);

      req.files?.forEach((file) => {
        mediaArray.push({
          url: `/uploads/user/achievement/certificate/pdfs/${file.filename}`,
          type: "pdf",
        });
      });
    }

    // Create UserAchievement
    const newUserAchievement = new UserAchievement({
      adminId,
      userId: validatedData.userId,
      media: mediaArray,
    });

    const createdUserAchievement = await newUserAchievement.save();

    if (!createdUserAchievement) {
      await deleteUploadedFiles(req);

      throw new ApiError(500, "Failed to create user achievement.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { userAchievement: createdUserAchievement },
          "User achievement created successfully."
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

    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Server Error: ${error.message}`));

    // throw new ApiError(500, `Error: ${error.message}`);
  }
});

export { addCertificateFromAdminSide };
