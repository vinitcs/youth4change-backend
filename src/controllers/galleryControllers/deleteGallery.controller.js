import { asyncHandler } from "../../utils/helper/AsyncHandler.js";
import path from "path";
// import fs from "fs";
import fs from "fs/promises";
// import { ApiError } from "../../utils/helper/ApiError.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { Gallery } from "../../models/gallery.model.js";

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

const deleteGallery = asyncHandler(async (req, res) => {
  const { galleryId } = req.body;
  try {
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No gallery data found!"));
    }
    await Gallery.deleteOne({ _id: galleryId });
    await deleteFileIfExists(`./public${gallery.url}`);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Gallery deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Something went wrong: ${error.message}`));
  }
});

export { deleteGallery };

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

// const deleteGallery = asyncHandler(async (req, res) => {
//   const { galleryId } = req.body;

//   try {
//     const gallery = await Gallery.findById({ _id: galleryId });

//     if (!gallery) {
//       return res
//         .status(404)
//         .json(new ApiResponse(404, {}, "No gallery data found!"));
//     }

//     await Gallery.deleteOne({ _id: galleryId });

//     // Now safely delete the associated media files (AFTER transaction commit)
//     const filePaths = gallery.media
//       .filter((mediaItem) => mediaItem.url) // Ensure URL exists
//       .map((mediaItem) => path.join("./public", mediaItem.url));

//     // Delete all associated media files
//     await Promise.all(filePaths.map(deleteFileIfExists));

//     return res
//       .status(200)
//       .json(new ApiResponse(200, {}, "Gallery deleted successfully."));
//   } catch (error) {
//     throw new ApiError(500, `Something went wrong: ${error.message}`);
//   }
// });
