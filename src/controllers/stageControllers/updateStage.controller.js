import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const updateStage = asyncHandler(async (req, res) => {
  const { stageId } = req.params; // Get stage ID from URL params
  const { title, description, lists } = req.body;

  // Find and update the stage
  const updatedStage = await Stage.findByIdAndUpdate(
    stageId,
    { title, description, lists },
    { new: true, runValidators: true }
  );

  // If stage not found, return error
  if (!updatedStage) {
    return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { stage: updatedStage }, "Stage updated successfully"));
});

export { updateStage };
