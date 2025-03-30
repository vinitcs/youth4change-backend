import { Stage } from "../../models/stage.model.js";
import { ApiResponse } from "../../utils/helper/ApiResponse.js";
import { asyncHandler } from "../../utils/helper/AsyncHandler.js";

const allStage = asyncHandler(async (req, res) => {
  const stages = await Stage.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, { stages }, "All stage fetched."));
});

export { allStage };
