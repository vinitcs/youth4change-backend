import { Gallery } from "../../models/gallery.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const allGallery = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  const allGalleryData = await Gallery.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (!allGalleryData || !allGalleryData.length) {
    const message =
      pageNum === 1 ? `No gallery found.` : "No more gallery data available.";

    return res.status(200).json(new ApiResponse(200, { gallerys: [] }, message));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        gallerys: allGalleryData,
      },
      `Successfully fetched galleries.`
    )
  );
});

export { allGallery };
