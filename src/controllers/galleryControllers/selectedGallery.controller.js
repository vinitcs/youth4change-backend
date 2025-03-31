import { Gallery } from "../../models/gallery.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const selectedGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const selectedGalleryData = await Gallery.findById({ _id: id }).lean();

  if (!selectedGalleryData) {
    return res.status(404).json(new ApiResponse(404, {}, `No gallery found!`));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...selectedGalleryData,
      },
      `Successfully fetched selected gallery data.`
    )
  );
});

export { selectedGallery };
