import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const deleteStage = asyncHandler(async (req, res) => {
  const { stageId } = req.body;

  const deletedStage = await Stage.findByIdAndDelete(stageId);

  if (!deletedStage) {
    return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Stage deleted successfully"));
});

export { deleteStage };
