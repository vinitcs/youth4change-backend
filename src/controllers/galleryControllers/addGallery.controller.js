import { ApiError } from "../../utils/helper/ApiError.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import fs from "fs/promises";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";
import { addGalleryValidationSchema } from "../../utils/helper/validations/galleryValidationSchema.js";
import { Gallery } from "../../models/gallery.model.js";

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    await fs.unlink(filePath); // Delete the file
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting gallery file: ${filePath}`, error.message);
    }
    // throw new ApiError(
    //   500,
    //   `Error deleting gallery file: ${error.message}`
    // );

    return false; // File did not exist or could not be deleted
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files) {
    const uploadedFiles = [];

    if (req.files.image) {
      req.files?.image?.forEach((file) => {
        uploadedFiles.push(`./public/uploads/gallery/images/${file.filename}`);
      });
    }

    if (req.files.video) {
      req.files?.video?.forEach((file) => {
        uploadedFiles.push(`./public/uploads/gallery/videos/${file.filename}`);
      });
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

const addGallery = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // get id from jwt middleware

  try {
    // Validate input data
    const validatedData = await addGalleryValidationSchema.validateAsync(
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
      if (req.files.image) {
        req.files?.image?.forEach((file) => {
          mediaArray.push({
            url: `/uploads/gallery/images/${file.filename}`,
            type: "image",
          });
        });
      }

      if (req.files.video) {
        req.files?.video?.forEach((file) => {
          mediaArray.push({
            url: `/uploads/gallery/videos/${file.filename}`,
            type: "video",
          });
        });
      }
    }

    // Create gallery
    const newGallery = new Gallery({
      adminId,
      description: validatedData.description,
      category: validatedData.category,
      media: mediaArray,
    });

    const createdGallery = await newGallery.save();

    if (!createdGallery) {
      await deleteUploadedFiles(req);

      throw new ApiError(500, "Failed to create gallery.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { Gallery: createdGallery },
          "Gallery post created successfully."
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

export { addGallery };
