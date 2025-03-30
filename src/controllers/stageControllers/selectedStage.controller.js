import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const selectedStage = asyncHandler(async (req, res) => {
  const stage = await Stage.findById(req.params.stageId).lean();
  if (!stage) {
    return res.status(404).json(new ApiResponse(404, {}, "Stage not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { ...stage }, "Selected stage data."));
});

export { selectedStage };
