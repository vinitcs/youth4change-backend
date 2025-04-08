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

    return false; // File did not exist or could not be deleted
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

const addGallery = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;

  const validatedData = await addGalleryValidationSchema.validateAsync(
    req.body
  );
  const admin = await Admin.findById(adminId);
  if (!admin) {
    await deleteUploadedFiles(req);
    return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json(new ApiResponse(400, {}, "No files uploaded."));
  }

  const galleryEntries = req.files.map((file) => ({
    adminId,
    description: validatedData.description,
    category: validatedData.category,
    url: file.mimetype.startsWith("image/")
      ? `/uploads/gallery/images/${file.filename}`
      : `/uploads/gallery/videos/${file.filename}`,
    type: file.mimetype.startsWith("image/") ? "image" : "video",
  }));

  const createdGalleries = await Gallery.insertMany(galleryEntries);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { galleries: createdGalleries },
        "Gallery entries created successfully."
      )
    );
});

export { addGallery };

//
//
//
//
//
//
//
//
//
//
//
//

// const addGallery = asyncHandler(async (req, res) => {
//   const adminId = req.admin._id; // get id from jwt middleware

//   try {
//     // Validate input data
//     const validatedData = await addGalleryValidationSchema.validateAsync(
//       req.body
//     );

//     const admin = await Admin.findById({ _id: adminId });

//     // Check if admin exists
//     if (!admin) {
//       await deleteUploadedFiles(req);

//       return res.status(404).json(new ApiResponse(404, {}, "Admin not found."));
//     }

//     // Process media uploads
//     let mediaArray = [];

//     if (req.files) {
//       console.log("gallery files", req.files);

//       req.files?.forEach((file) => {
//         mediaArray.push({
//           url: file.mimetype.startsWith("image/")
//             ? `/uploads/gallery/images/${file.filename}`
//             : file.mimetype.startsWith("video/")
//               ? `/uploads/gallery/videos/${file.filename}`
//               : "",

//           type: file.mimetype.startsWith("image/")
//             ? `image`
//             : file.mimetype.startsWith("video/")
//               ? `video`
//               : "",
//         });
//       });
//     }

//     // Create gallery
//     const newGallery = new Gallery({
//       adminId,
//       description: validatedData.description,
//       category: validatedData.category,
//       media: mediaArray,
//     });

//     const createdGallery = await newGallery.save();

//     if (!createdGallery) {
//       await deleteUploadedFiles(req);

//       throw new ApiError(500, "Failed to create gallery.");
//     }

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           { Gallery: createdGallery },
//           "Gallery created successfully."
//         )
//       );
//   } catch (error) {
//     await deleteUploadedFiles(req);

//     if (error.isJoi) {
//       // Handle JOI validation errors
//       return res
//         .status(400)
//         .json(new ApiResponse(400, {}, `Validation Error: ${error.message}`));
//     }

//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, `Server Error: ${error.message}`));

//     // throw new ApiError(500, `Error: ${error.message}`);
//   }
// });
