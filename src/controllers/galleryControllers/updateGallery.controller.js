import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import path from "path";
// import fs from "fs";
import fs from "fs/promises";
import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Admin } from "../../models/admin.model.js";
import { updateGalleryValidationSchema } from "../../utils/helper/validations/galleryValidationSchema.js";
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
  }
};

const deleteUploadedFiles = async (req) => {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const filePath = `./public/uploads/gallery/${file.mimetype.startsWith("image/") ? "images" : "videos"}/${file.filename}`;
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

const updateGallery = asyncHandler(async (req, res) => {
  const adminId = req.admin._id; // get id from jwt middleware

  try {
    const { galleryId, description, category, deleteMedia } = req.body;

    const validatedData = await updateGalleryValidationSchema.validateAsync({
      galleryId,
      description,
      category,
    });

    // Find the admin updating the gallery
    const admin = await Admin.findById({ _id: adminId });

    if (!admin) {
      await deleteUploadedFiles(req);

      return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
    }

    const gallery = await Gallery.findById({ _id: validatedData.galleryId });

    if (!gallery) {
      await deleteUploadedFiles(req);

      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Gallery not found."));
    }

    // Ensure admin owns the gallery
    if (gallery.adminId.toString() !== req.admin._id.toString()) {
      await deleteUploadedFiles(req);

      return res.status(403).json(new ApiResponse(403, {}, "Unauthorized."));
    }

    let updatedMedia = [...gallery.media]; // Clone the existing media array

    let mediaToDelete = [];

    // 1. Delete Only Provided Media URLs
    if (Array.isArray(deleteMedia)) {
      mediaToDelete = deleteMedia; // Use directly if it's already an array
    } else if (typeof deleteMedia === "string" && deleteMedia.trim() !== "") {
      try {
        mediaToDelete = JSON.parse(deleteMedia); // Parse if it's a JSON string
      } catch (error) {
        await deleteUploadedFiles(req);

        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Invalid deleteMedia format."));
      }
    }

    if (mediaToDelete.length > 0) {
      updatedMedia = updatedMedia.filter(
        (item) => !mediaToDelete.includes(item.url)
      );

      for (const fileUrl of mediaToDelete) {
        const filePath = path.join("./public", fileUrl);
        await deleteFileIfExists(filePath);
      }
    }

    // 2. Add New Media Files
    if (req.files) {
      console.log("gallery files", req.files);

      req.files?.forEach((file) => {
        updatedMedia.push({
          url: file.mimetype.startsWith("image/")
            ? `/uploads/gallery/images/${file.filename}`
            : file.mimetype.startsWith("video/")
              ? `/uploads/gallery/videos/${file.filename}`
              : "",

          type: file.mimetype.startsWith("image/")
            ? `image`
            : file.mimetype.startsWith("video/")
              ? `video`
              : "",
        });
      });
    }

    // 5. Update Gallery in Database
    gallery.description = validatedData.description || gallery.description;
    gallery.category = validatedData.category || gallery.category;
    gallery.media = updatedMedia; // Only the required media is updated

    const updatedGallery = await gallery.save();

    if (!updatedGallery) {
      await deleteUploadedFiles(req);

      throw new ApiError(500, "Something went wrong to update gallery.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedGallery: updatedGallery },
          "Gallery updated successfully."
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

export { updateGallery };
